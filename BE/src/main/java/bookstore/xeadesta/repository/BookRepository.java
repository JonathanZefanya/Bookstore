package bookstore.xeadesta.repository;

import bookstore.xeadesta.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByIsbn(String isbn);

    @Query("""
        SELECT b FROM Book b
        WHERE (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%',:search,'%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:categoryId IS NULL OR b.category.id = :categoryId)
          AND (:publisherId IS NULL OR b.publisher.id = :publisherId)
          AND (:minPrice IS NULL OR b.price >= :minPrice)
          AND (:maxPrice IS NULL OR b.price <= :maxPrice)
        """)
    Page<Book> findWithFilters(
        @Param("search") String search,
        @Param("categoryId") Long categoryId,
        @Param("publisherId") Long publisherId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );

    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Book> findByPublisherId(Long publisherId, Pageable pageable);
}
