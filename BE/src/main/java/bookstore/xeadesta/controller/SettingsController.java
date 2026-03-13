package bookstore.xeadesta.controller;

import bookstore.xeadesta.entity.Settings;
import bookstore.xeadesta.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {
    
    @Autowired
    private SettingsService settingsService;
    
    @GetMapping
    public ResponseEntity<?> getSettings() {
        try {
            Settings settings = settingsService.getSettings();
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching settings: " + e.getMessage());
        }
    }
    
    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody Settings settings) {
        try {
            Settings updated = settingsService.updateSettings(settings);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating settings: " + e.getMessage());
        }
    }
    
    @PostMapping("/upload-logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file selected");
            }
            Settings settings = settingsService.uploadLogo(file);
            return ResponseEntity.ok(settings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading logo: " + e.getMessage());
        }
    }
    
    @PostMapping("/upload-favicon")
    public ResponseEntity<?> uploadFavicon(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file selected");
            }
            Settings settings = settingsService.uploadFavicon(file);
            return ResponseEntity.ok(settings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading favicon: " + e.getMessage());
        }
    }
    
    @PostMapping("/upload-og-image")
    public ResponseEntity<?> uploadOgImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file selected");
            }
            Settings settings = settingsService.uploadOgImage(file);
            return ResponseEntity.ok(settings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading og image: " + e.getMessage());
        }
    }
}
