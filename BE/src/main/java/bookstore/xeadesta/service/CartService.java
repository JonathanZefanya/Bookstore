package bookstore.xeadesta.service;

import bookstore.xeadesta.entity.Cart;
import bookstore.xeadesta.entity.CartItem;
import bookstore.xeadesta.entity.Book;
import bookstore.xeadesta.entity.User;
import bookstore.xeadesta.repository.CartRepository;
import bookstore.xeadesta.repository.BookRepository;
import bookstore.xeadesta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    @Transactional
    public Cart addItem(Long userId, Long bookId, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be at least 1");

        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getStock() < quantity) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + book.getStock());
        }

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
            .filter(i -> i.getBook().getId().equals(bookId))
            .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + quantity;
            if (book.getStock() < newQty) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + book.getStock());
            }
            item.setQuantity(newQty);
        } else {
            CartItem item = CartItem.builder()
                .cart(cart)
                .book(book)
                .quantity(quantity)
                .build();
            cart.getItems().add(item);
        }
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateItem(Long userId, Long bookId, int quantity) {
        if (quantity < 0) throw new IllegalArgumentException("Quantity cannot be negative");

        Cart cart = getOrCreateCart(userId);

        if (quantity == 0) {
            cart.getItems().removeIf(i -> i.getBook().getId().equals(bookId));
        } else {
            Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
            if (book.getStock() < quantity) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + book.getStock());
            }
            cart.getItems().stream()
                .filter(i -> i.getBook().getId().equals(bookId))
                .findFirst()
                .ifPresent(i -> i.setQuantity(quantity));
        }
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItem(Long userId, Long bookId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getBook().getId().equals(bookId));
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }
}
