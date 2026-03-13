package bookstore.xeadesta.service;

import bookstore.xeadesta.entity.Book;
import bookstore.xeadesta.repository.BookRepository;
import bookstore.xeadesta.util.SlugUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    public Optional<Book> getBookById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid book ID");
        }
        return bookRepository.findById(id);
    }
    
    public Optional<Book> getBookBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Invalid book slug");
        }
        return bookRepository.findBySlug(slug);
    }
    
    public Book createBook(Book book) {
        if (book.getTitle() == null || book.getTitle().isBlank()) {
            throw new IllegalArgumentException("Book title is required");
        }
        if (book.getSlug() == null || book.getSlug().isBlank()) {
            String generatedSlug = SlugUtil.toSlug(book.getTitle());
            // Ensure slug uniqueness
            String uniqueSlug = generatedSlug;
            int counter = 1;
            while (bookRepository.findBySlug(uniqueSlug).isPresent()) {
                uniqueSlug = generatedSlug + "-" + counter++;
            }
            book.setSlug(uniqueSlug);
        }
        if (book.getPrice() != null && book.getPrice() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        return bookRepository.save(book);
    }
    
    public Book updateBook(Long id, Book bookUpdate) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid book ID");
        }
        return bookRepository.findById(id).map(book -> {
            if (bookUpdate.getTitle() != null && !bookUpdate.getTitle().isBlank()) {
                book.setTitle(bookUpdate.getTitle());
                if (bookUpdate.getSlug() == null || bookUpdate.getSlug().isBlank()) {
                    String generatedSlug = SlugUtil.toSlug(bookUpdate.getTitle());
                    String uniqueSlug = generatedSlug;
                    int counter = 1;
                    while (bookRepository.findBySlug(uniqueSlug).isPresent() &&
                           !bookRepository.findBySlug(uniqueSlug).get().getId().equals(id)) {
                        uniqueSlug = generatedSlug + "-" + counter++;
                    }
                    book.setSlug(uniqueSlug);
                } else {
                    book.setSlug(bookUpdate.getSlug());
                }
            }
            if (bookUpdate.getDescription() != null) {
                book.setDescription(bookUpdate.getDescription());
            }
            if (bookUpdate.getAuthor() != null) {
                book.setAuthor(bookUpdate.getAuthor());
            }
            if (bookUpdate.getCover() != null) {
                book.setCover(bookUpdate.getCover());
            }
            if (bookUpdate.getIsbn() != null) {
                book.setIsbn(bookUpdate.getIsbn());
            }
            if (bookUpdate.getPrice() != null) {
                if (bookUpdate.getPrice() < 0) {
                    throw new IllegalArgumentException("Price cannot be negative");
                }
                book.setPrice(bookUpdate.getPrice());
            }
            if (bookUpdate.getPublishYear() != null) {
                book.setPublishYear(bookUpdate.getPublishYear());
            }
            if (bookUpdate.getContent() != null) {
                book.setContent(bookUpdate.getContent());
            }
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book with ID " + id + " not found"));
    }
    
    public void deleteBook(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid book ID");
        }
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book with ID " + id + " not found");
        }
        bookRepository.deleteById(id);
    }
}
