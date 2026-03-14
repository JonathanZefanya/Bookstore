package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.dto.BookDto;
import bookstore.xeadesta.entity.Book;
import bookstore.xeadesta.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired private BookService bookService;
    @Autowired private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Book>>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long publisherId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<Book> books = bookService.getBooks(search, categoryId, publisherId, minPrice, maxPrice, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(books));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Book>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getBySlug(slug)));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<Book>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Book>> create(
            @RequestPart("book") String bookJson,
            @RequestPart(value = "cover", required = false) MultipartFile cover) throws IOException {
        BookDto.CreateRequest req = objectMapper.readValue(bookJson, BookDto.CreateRequest.class);
        Book book = bookService.create(req, cover);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book created", book));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Book>> update(
            @PathVariable Long id,
            @RequestPart("book") String bookJson,
            @RequestPart(value = "cover", required = false) MultipartFile cover) throws IOException {
        BookDto.UpdateRequest req = objectMapper.readValue(bookJson, BookDto.UpdateRequest.class);
        Book book = bookService.update(id, req, cover);
        return ResponseEntity.ok(ApiResponse.success("Book updated", book));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Book>> updateStock(
            @PathVariable Long id,
            @RequestParam int stock) {
        BookDto.UpdateRequest req = new BookDto.UpdateRequest();
        req.setStock(stock);
        try {
            Book book = bookService.update(id, req, null);
            return ResponseEntity.ok(ApiResponse.success("Stock updated", book));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted", null));
    }
}
