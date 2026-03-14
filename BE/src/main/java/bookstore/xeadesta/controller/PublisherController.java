package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.entity.Publisher;
import bookstore.xeadesta.repository.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publishers")

public class PublisherController {

    @Autowired private PublisherRepository publisherRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Publisher>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(publisherRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Publisher>> getById(@PathVariable Long id) {
        Publisher pub = publisherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Publisher not found"));
        return ResponseEntity.ok(ApiResponse.success(pub));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Publisher>> create(@RequestBody Publisher publisher) {
        if (publisher.getName() == null || publisher.getName().isBlank()) {
            throw new IllegalArgumentException("Publisher name is required");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Publisher created", publisherRepository.save(publisher)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Publisher>> update(@PathVariable Long id, @RequestBody Publisher update) {
        Publisher pub = publisherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Publisher not found"));
        if (update.getName() != null) pub.setName(update.getName());
        if (update.getDescription() != null) pub.setDescription(update.getDescription());
        if (update.getWebsite() != null) pub.setWebsite(update.getWebsite());
        return ResponseEntity.ok(ApiResponse.success("Publisher updated", publisherRepository.save(pub)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!publisherRepository.existsById(id)) throw new RuntimeException("Publisher not found");
        publisherRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Publisher deleted", null));
    }
}
