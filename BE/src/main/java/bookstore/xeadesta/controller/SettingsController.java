package bookstore.xeadesta.controller;

import bookstore.xeadesta.dto.ApiResponse;
import bookstore.xeadesta.entity.Settings;
import bookstore.xeadesta.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/settings")

public class SettingsController {

    @Autowired private SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<Settings>> get() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Settings>> update(@RequestBody Settings settings) {
        return ResponseEntity.ok(ApiResponse.success("Settings updated", settingsService.updateSettings(settings)));
    }

    @PostMapping("/logo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Settings>> uploadLogo(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Logo uploaded", settingsService.uploadLogo(file)));
    }

    @PostMapping("/favicon")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Settings>> uploadFavicon(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Favicon uploaded", settingsService.uploadFavicon(file)));
    }

    @PostMapping("/og-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Settings>> uploadOgImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("OG image uploaded", settingsService.uploadOgImage(file)));
    }
}
