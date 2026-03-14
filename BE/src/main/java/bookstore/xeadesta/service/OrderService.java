package bookstore.xeadesta.service;

import bookstore.xeadesta.dto.CheckoutDto;
import bookstore.xeadesta.entity.*;
import bookstore.xeadesta.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    // Simulated shipping cost: 10 per 100g, minimum 10000 IDR equivalent cents = 1.0 USD — here flat $1 per kg
    private static final BigDecimal SHIPPING_RATE_PER_KG = new BigDecimal("5.00"); // $5 per kg

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public Order checkout(Long userId, CheckoutDto.CheckoutRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate totals
        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalWeightGram = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();
            if (book.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for: " + book.getTitle());
            }
            BigDecimal itemSubtotal = book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemSubtotal);
            totalWeightGram += book.getWeightGram() * cartItem.getQuantity();

            OrderItem oi = OrderItem.builder()
                .book(book)
                .quantity(cartItem.getQuantity())
                .price(book.getPrice())
                .subtotal(itemSubtotal)
                .build();
            orderItems.add(oi);

            // Deduct stock
            book.setStock(book.getStock() - cartItem.getQuantity());
            bookRepository.save(book);
        }

        // Shipping: $5 per kg, min $1
        BigDecimal weightKg = BigDecimal.valueOf(totalWeightGram).divide(BigDecimal.valueOf(1000), 3, java.math.RoundingMode.CEILING);
        BigDecimal shippingCost = SHIPPING_RATE_PER_KG.multiply(weightKg).max(new BigDecimal("1.00"));
        shippingCost = shippingCost.setScale(2, java.math.RoundingMode.CEILING);

        BigDecimal grandTotal = totalAmount.add(shippingCost);

        Order order = Order.builder()
            .user(user)
            .totalAmount(totalAmount)
            .shippingCost(shippingCost)
            .grandTotal(grandTotal)
            .shippingAddress(request.getShippingAddress() != null
                ? request.getShippingAddress() : user.getAddress())
            .notes(request.getNotes())
            .paymentStatus(PaymentStatus.PAID)   // Simulate immediate payment
            .orderStatus(OrderStatus.PENDING)
            .items(orderItems)
            .build();

        // Set bidirectional references
        orderItems.forEach(oi -> oi.setOrder(order));

        Order saved = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return saved;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    public Page<Order> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        try {
            order.setOrderStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
        return orderRepository.save(order);
    }

    public Map<String, Object> getDashboardStats() {
        long totalOrders = orderRepository.count();
        long paidOrders = orderRepository.countPaidOrders();
        BigDecimal revenue = orderRepository.sumRevenue();

        return Map.of(
            "totalOrders", totalOrders,
            "paidOrders", paidOrders,
            "totalRevenue", revenue != null ? revenue : BigDecimal.ZERO,
            "pendingOrders", orderRepository.countByOrderStatus(OrderStatus.PENDING)
        );
    }
}
