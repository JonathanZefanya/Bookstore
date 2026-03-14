package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.entity.Category;
import bookstore.xeadesta.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getById(@PathVariable Long id) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok(ApiResponse.success(cat));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Category>> getBySlug(@PathVariable String slug) {
        Category cat = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok(ApiResponse.success(cat));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Category>> create(@RequestBody Category category) {
        if (category.getName() == null || category.getName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new IllegalArgumentException("Category slug already exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Category created", categoryRepository.save(category)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Category>> update(@PathVariable Long id, @RequestBody Category update) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        if (update.getName() != null) cat.setName(update.getName());
        if (update.getDescription() != null) cat.setDescription(update.getDescription());
        return ResponseEntity.ok(ApiResponse.success("Category updated", categoryRepository.save(cat)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) throw new RuntimeException("Category not found");
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
