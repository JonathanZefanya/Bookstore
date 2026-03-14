package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.entity.Review;
import bookstore.xeadesta.security.CustomUserDetails;
import bookstore.xeadesta.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @GetMapping("/book/{bookId}")
    public ResponseEntity<ApiResponse<List<Review>>> getByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByBook(bookId)));
    }

    @GetMapping("/book/{bookId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(@PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getBookRatingSummary(bookId)));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Review>> create(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Object> body) {
        Long bookId = Long.valueOf(body.get("bookId").toString());
        int rating = Integer.parseInt(body.get("rating").toString());
        String comment = body.containsKey("comment") ? body.get("comment").toString() : null;
        Review review = reviewService.createReview(user.getId(), bookId, rating, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review submitted", review));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
