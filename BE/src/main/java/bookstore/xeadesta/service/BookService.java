package bookstore.xeadesta.service;

import bookstore.xeadesta.dto.BookDto;
import bookstore.xeadesta.entity.Book;
import bookstore.xeadesta.entity.Category;
import bookstore.xeadesta.entity.Publisher;
import bookstore.xeadesta.repository.BookRepository;
import bookstore.xeadesta.repository.CategoryRepository;
import bookstore.xeadesta.repository.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class BookService {

    @Autowired private BookRepository bookRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private PublisherRepository publisherRepository;
    @Autowired private FileUploadService fileUploadService;

    public Page<Book> getBooks(String search, Long categoryId, Long publisherId,
                                BigDecimal minPrice, BigDecimal maxPrice,
                                int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchParam = (search != null && !search.isBlank()) ? search : null;
        return bookRepository.findWithFilters(searchParam, categoryId, publisherId, minPrice, maxPrice, pageable);
    }

    public Book getBySlug(String slug) {
        return bookRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Book not found: " + slug));
    }

    public Book getById(Long id) {
        return bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found: " + id));
    }

    public Book create(BookDto.CreateRequest req, MultipartFile cover) throws IOException {
        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        String slug = generateUniqueSlug(req.getTitle());
        if (req.getIsbn() != null && !req.getIsbn().isBlank() && bookRepository.existsByIsbn(req.getIsbn())) {
            throw new IllegalArgumentException("ISBN already exists");
        }

        Book book = Book.builder()
            .title(req.getTitle())
            .slug(slug)
            .author(req.getAuthor())
            .isbn(req.getIsbn())
            .description(req.getDescription())
            .price(req.getPrice() != null ? req.getPrice() : BigDecimal.ZERO)
            .weightGram(req.getWeightGram() != null ? req.getWeightGram() : 300)
            .publishYear(req.getPublishYear())
            .stock(req.getStock() != null ? req.getStock() : 0)
            .build();

        if (req.getPublisherId() != null) {
            publisherRepository.findById(req.getPublisherId()).ifPresent(book::setPublisher);
        }
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(book::setCategory);
        }
        if (cover != null && !cover.isEmpty()) {
            book.setCoverImage(fileUploadService.uploadBookCover(cover));
        }
        return bookRepository.save(book);
    }

    public Book update(Long id, BookDto.UpdateRequest req, MultipartFile cover) throws IOException {
        Book book = getById(id);

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            book.setTitle(req.getTitle());
        }
        if (req.getAuthor() != null) book.setAuthor(req.getAuthor());
        if (req.getIsbn() != null) book.setIsbn(req.getIsbn());
        if (req.getDescription() != null) book.setDescription(req.getDescription());
        if (req.getPrice() != null) {
            if (req.getPrice().compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException("Price cannot be negative");
            book.setPrice(req.getPrice());
        }
        if (req.getWeightGram() != null) book.setWeightGram(req.getWeightGram());
        if (req.getPublishYear() != null) book.setPublishYear(req.getPublishYear());
        if (req.getStock() != null) {
            if (req.getStock() < 0) throw new IllegalArgumentException("Stock cannot be negative");
            book.setStock(req.getStock());
        }
        if (req.getPublisherId() != null) {
            publisherRepository.findById(req.getPublisherId()).ifPresent(book::setPublisher);
        }
        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(book::setCategory);
        }
        if (cover != null && !cover.isEmpty()) {
            if (book.getCoverImage() != null) {
                try { fileUploadService.deleteFile(book.getCoverImage()); } catch (Exception ignored) {}
            }
            book.setCoverImage(fileUploadService.uploadBookCover(cover));
        }
        return bookRepository.save(book);
    }

    public void delete(Long id) {
        Book book = getById(id);
        if (book.getCoverImage() != null) {
            try { fileUploadService.deleteFile(book.getCoverImage()); } catch (Exception ignored) {}
        }
        bookRepository.deleteById(id);
    }

    private String generateUniqueSlug(String title) {
        String base = title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        String slug = base;
        int i = 1;
        while (bookRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }
}
