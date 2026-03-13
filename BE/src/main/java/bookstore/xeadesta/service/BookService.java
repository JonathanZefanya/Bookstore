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
        return bookRepository.findById(id);
    }
    
    public Optional<Book> getBookBySlug(String slug) {
        return bookRepository.findBySlug(slug);
    }
    
    public Book createBook(Book book) {
        if (book.getSlug() == null || book.getSlug().isEmpty()) {
            book.setSlug(SlugUtil.toSlug(book.getTitle()));
        }
        return bookRepository.save(book);
    }
    
    public Book updateBook(Long id, Book bookUpdate) {
        return bookRepository.findById(id).map(book -> {
            if (bookUpdate.getTitle() != null) {
                book.setTitle(bookUpdate.getTitle());
                if (bookUpdate.getSlug() == null || bookUpdate.getSlug().isEmpty()) {
                    book.setSlug(SlugUtil.toSlug(bookUpdate.getTitle()));
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
                book.setPrice(bookUpdate.getPrice());
            }
            if (bookUpdate.getPublishYear() != null) {
                book.setPublishYear(bookUpdate.getPublishYear());
            }
            if (bookUpdate.getContent() != null) {
                book.setContent(bookUpdate.getContent());
            }
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found"));
    }
    
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
