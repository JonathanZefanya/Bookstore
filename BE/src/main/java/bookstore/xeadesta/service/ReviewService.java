package bookstore.xeadesta.service;

import bookstore.xeadesta.entity.Review;
import bookstore.xeadesta.entity.Book;
import bookstore.xeadesta.entity.User;
import bookstore.xeadesta.repository.ReviewRepository;
import bookstore.xeadesta.repository.BookRepository;
import bookstore.xeadesta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private UserRepository userRepository;

    public List<Review> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    public Map<String, Object> getBookRatingSummary(Long bookId) {
        Double avg = reviewRepository.findAverageRatingByBookId(bookId);
        Long count = reviewRepository.countByBookId(bookId);
        return Map.of(
            "average", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0,
            "count", count != null ? count : 0L
        );
    }

    public Review createReview(Long userId, Long bookId, Integer rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new IllegalArgumentException("You have already reviewed this book");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

        Review review = Review.builder()
            .user(user).book(book)
            .rating(rating).comment(comment)
            .build();
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(id);
    }
}
