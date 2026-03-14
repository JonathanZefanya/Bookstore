package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.entity.User;
import bookstore.xeadesta.entity.Role;
import bookstore.xeadesta.security.CustomUserDetails;
import bookstore.xeadesta.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController

public class UserController {

    @Autowired private UserService userService;

    // Current user profile
    @GetMapping("/api/user/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(user.getId())));
    }

    @PutMapping("/api/user/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody User update) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(user.getId(), update)));
    }

    @PutMapping("/api/user/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, String> body) {
        userService.changePassword(user.getId(), body.get("oldPassword"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Password changed", null));
    }

    // ADMIN — Manage all users
    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> adminUpdateUser(
            @PathVariable Long id,
            @RequestBody User update) {
        return ResponseEntity.ok(ApiResponse.success("User updated", userService.adminUpdateUser(id, update)));
    }

    @PatchMapping("/api/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser.getId().equals(id)) {
            throw new IllegalArgumentException("You cannot change your own role");
        }
        return ResponseEntity.ok(ApiResponse.success("Role updated", userService.updateUserRole(id, body.get("role"))));
    }

    @PatchMapping("/api/admin/users/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> toggleActive(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser.getId().equals(id)) {
            throw new IllegalArgumentException("You cannot disable your own account");
        }
        return ResponseEntity.ok(ApiResponse.success("User status toggled", userService.toggleUserActive(id)));
    }

    @DeleteMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser.getId().equals(id)) {
            throw new IllegalArgumentException("You cannot delete your own account");
        }
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }
}
