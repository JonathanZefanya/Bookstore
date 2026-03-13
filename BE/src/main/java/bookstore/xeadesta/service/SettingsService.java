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
        return settings.orElse(new Settings());
    }
    
    public Settings updateSettings(Settings settingsUpdate) {
        Optional<Settings> existing = settingsRepository.findAll().stream().findFirst();
        Settings settings = existing.orElse(new Settings());
        
        if (settingsUpdate.getSiteName() != null) {
            settings.setSiteName(settingsUpdate.getSiteName());
        }
        if (settingsUpdate.getThemeColor() != null) {
            settings.setThemeColor(settingsUpdate.getThemeColor());
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
        String fileName = fileUploadService.uploadFile(file);
        Optional<Settings> existing = settingsRepository.findAll().stream().findFirst();
        Settings settings = existing.orElse(new Settings());
        
        // Delete old logo if exists
        if (settings.getSiteLogo() != null) {
            try {
                fileUploadService.deleteFile(settings.getSiteLogo());
            } catch (IOException e) {
                // Log error but continue
                e.printStackTrace();
            }
        }
        
        settings.setSiteLogo(fileName);
        return settingsRepository.save(settings);
    }
    
    public Settings uploadFavicon(MultipartFile file) throws IOException {
        String fileName = fileUploadService.uploadFile(file);
        Optional<Settings> existing = settingsRepository.findAll().stream().findFirst();
        Settings settings = existing.orElse(new Settings());
        
        // Delete old favicon if exists
        if (settings.getSiteFavicon() != null) {
            try {
                fileUploadService.deleteFile(settings.getSiteFavicon());
            } catch (IOException e) {
                // Log error but continue
                e.printStackTrace();
            }
        }
        
        settings.setSiteFavicon(fileName);
        return settingsRepository.save(settings);
    }
    
    public Settings uploadOgImage(MultipartFile file) throws IOException {
        String fileName = fileUploadService.uploadFile(file);
        Optional<Settings> existing = settingsRepository.findAll().stream().findFirst();
        Settings settings = existing.orElse(new Settings());
        
        // Delete old og image if exists
        if (settings.getOgImage() != null) {
            try {
                fileUploadService.deleteFile(settings.getOgImage());
            } catch (IOException e) {
                // Log error but continue
                e.printStackTrace();
            }
        }
        
        settings.setOgImage(fileName);
        return settingsRepository.save(settings);
    }
}
