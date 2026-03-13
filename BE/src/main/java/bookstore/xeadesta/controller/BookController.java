package bookstore.xeadesta.controller;

import bookstore.xeadesta.entity.Book;
import bookstore.xeadesta.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    @GetMapping
    public ResponseEntity<?> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookService.getBookById(id);
        if (book.isEmpty()) {
            return notFound("Book with ID " + id + " not found");
        }
        return ResponseEntity.ok(book.get());
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getBookBySlug(@PathVariable String slug) {
        Optional<Book> book = bookService.getBookBySlug(slug);
        if (book.isEmpty()) {
            return notFound("Book '" + slug + "' not found");
        }
        return ResponseEntity.ok(book.get());
    }
    
    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody Book book) {
        Book created = bookService.createBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updated = bookService.updateBook(id, book);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Book deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    private ResponseEntity<Map<String, Object>> notFound(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 404);
        response.put("error", "Not Found");
        response.put("message", message);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
