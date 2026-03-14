package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.dto.CheckoutDto;
import bookstore.xeadesta.entity.Order;
import bookstore.xeadesta.security.CustomUserDetails;
import bookstore.xeadesta.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired private OrderService orderService;

    // USER — checkout
    @PostMapping("/api/user/orders/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CheckoutDto.CheckoutRequest request) {
        Order order = orderService.checkout(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    // USER — own orders
    @GetMapping("/api/user/orders")
    public ResponseEntity<ApiResponse<List<Order>>> myOrders(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrdersByUser(user.getId())));
    }

    // USER — single order detail
    @GetMapping("/api/user/orders/{id}")
    public ResponseEntity<ApiResponse<Order>> myOrderDetail(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    // STAFF/ADMIN — all orders
    @GetMapping("/api/staff/orders")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Page<Order>>> allOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(page, size)));
    }

    // STAFF/ADMIN — update status
    @PatchMapping("/api/staff/orders/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    // ADMIN — dashboard stats
    @GetMapping("/api/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> stats() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getDashboardStats()));
    }
}
