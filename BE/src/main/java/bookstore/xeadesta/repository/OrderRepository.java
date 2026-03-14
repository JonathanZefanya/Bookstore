package bookstore.xeadesta.repository;

import bookstore.xeadesta.entity.Order;
import bookstore.xeadesta.entity.OrderStatus;
import bookstore.xeadesta.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'PAID'")
    Long countPaidOrders();

    @Query("SELECT SUM(o.grandTotal) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal sumRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = :status")
    Long countByOrderStatus(OrderStatus status);
}
