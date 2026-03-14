package bookstore.xeadesta.service;

import bookstore.xeadesta.entity.Settings;
import bookstore.xeadesta.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class SettingsService {
    
    @Autowired
    private SettingsRepository settingsRepository;
    
    @Autowired
    private FileUploadService fileUploadService;
    
    public Settings getSettings() {
        Optional<Settings> settings = settingsRepository.findAll().stream().findFirst();
        if (settings.isEmpty()) {
            Settings defaultSettings = new Settings();
            defaultSettings.setSiteName("Bookstore");
            defaultSettings.setThemeColor("#4f46e5");
            return settingsRepository.save(defaultSettings);
        }
        return settings.get();
    }
    
    public Settings updateSettings(Settings settingsUpdate) {
        Optional<Settings> existing = settingsRepository.findAll().stream().findFirst();
        Settings settings = existing.orElse(new Settings());
        
        if (settingsUpdate.getSiteName() != null) {
            String name = settingsUpdate.getSiteName().trim();
            if (name.isEmpty()) {
                throw new IllegalArgumentException("Site name cannot be empty");
            }
            settings.setSiteName(name);
        }
        
        if (settings.getSiteName() == null || settings.getSiteName().isBlank()) {
            settings.setSiteName("Bookstore");
        }
        
        if (settingsUpdate.getThemeColor() != null) {
            String color = settingsUpdate.getThemeColor().trim();
            if (!color.isEmpty() && !color.matches("^#[0-9A-Fa-f]{6}$")) {
                throw new IllegalArgumentException("Invalid theme color format. Use hex like #4f46e5");
            }
            settings.setThemeColor(color);
        }
        if (settingsUpdate.getFooterText() != null) {
            settings.setFooterText(settingsUpdate.getFooterText());
        }
        if (settingsUpdate.getMetaTitle() != null) {
            settings.setMetaTitle(settingsUpdate.getMetaTitle());
        }
        if (settingsUpdate.getMetaDescription() != null) {
            settings.setMetaDescription(settingsUpdate.getMetaDescription());
        }
        if (settingsUpdate.getMetaKeywords() != null) {
            settings.setMetaKeywords(settingsUpdate.getMetaKeywords());
        }
        if (settingsUpdate.getOgTitle() != null) {
            settings.setOgTitle(settingsUpdate.getOgTitle());
        }
        if (settingsUpdate.getOgDescription() != null) {
            settings.setOgDescription(settingsUpdate.getOgDescription());
        }
        if (settingsUpdate.getCanonicalUrl() != null) {
            settings.setCanonicalUrl(settingsUpdate.getCanonicalUrl());
        }
        
        return settingsRepository.save(settings);
    }
    
    public Settings uploadLogo(MultipartFile file) throws IOException {
        validateFile(file);
        String fileName = fileUploadService.uploadBranding(file);
        Settings settings = getOrCreateSettings();
        deleteFileIfExists(settings.getSiteLogo());
        settings.setSiteLogo(fileName);
        return settingsRepository.save(settings);
    }
    
    public Settings uploadFavicon(MultipartFile file) throws IOException {
        validateFile(file);
        String fileName = fileUploadService.uploadBranding(file);
        Settings settings = getOrCreateSettings();
        deleteFileIfExists(settings.getSiteFavicon());
        settings.setSiteFavicon(fileName);
        return settingsRepository.save(settings);
    }
    
    public Settings uploadOgImage(MultipartFile file) throws IOException {
        validateFile(file);
        String fileName = fileUploadService.uploadBranding(file);
        Settings settings = getOrCreateSettings();
        deleteFileIfExists(settings.getOgImage());
        settings.setOgImage(fileName);
        return settingsRepository.save(settings);
    }
    
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided or file is empty");
        }
    }
    
    private Settings getOrCreateSettings() {
        Optional<Settings> existing = settingsRepository.findAll().stream().findFirst();
        Settings settings = existing.orElse(new Settings());
        if (settings.getSiteName() == null || settings.getSiteName().isBlank()) {
            settings.setSiteName("Bookstore");
        }
        return settings;
    }
    
    private void deleteFileIfExists(String fileName) {
        if (fileName != null && !fileName.isBlank()) {
            try {
                fileUploadService.deleteFile(fileName);
            } catch (IOException e) {
                System.err.println("Warning: Could not delete old file: " + fileName + " - " + e.getMessage());
            }
        }
    }
}
