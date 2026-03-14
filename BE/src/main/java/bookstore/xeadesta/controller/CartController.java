package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.entity.Cart;
import bookstore.xeadesta.security.CustomUserDetails;
import bookstore.xeadesta.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(@AuthenticationPrincipal CustomUserDetails user) {
        Cart cart = cartService.getOrCreateCart(user.getId());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Cart>> addItem(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Object> body) {
        Long bookId = Long.valueOf(body.get("bookId").toString());
        int qty = body.containsKey("quantity") ? Integer.parseInt(body.get("quantity").toString()) : 1;
        Cart cart = cartService.addItem(user.getId(), bookId, qty);
        return ResponseEntity.ok(ApiResponse.success("Added to cart", cart));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Cart>> updateItem(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Object> body) {
        Long bookId = Long.valueOf(body.get("bookId").toString());
        int qty = Integer.parseInt(body.get("quantity").toString());
        Cart cart = cartService.updateItem(user.getId(), bookId, qty);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<ApiResponse<Cart>> removeItem(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long bookId) {
        Cart cart = cartService.removeItem(user.getId(), bookId);
        return ResponseEntity.ok(ApiResponse.success("Removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal CustomUserDetails user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
