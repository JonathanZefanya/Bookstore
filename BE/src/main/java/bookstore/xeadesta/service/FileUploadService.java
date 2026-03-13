package bookstore.xeadesta.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class FileUploadService {
    
    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;
    
    @Value("${file.max-size:2097152}")
    private long maxFileSize;
    
    @Value("${file.allowed-types:png,jpg,jpeg,webp,ico}")
    private String allowedTypes;
    
    private static final Set<String> ALLOWED_MIME_TYPES = new HashSet<>(Arrays.asList(
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/x-icon"
    ));
    
    public String uploadFile(MultipartFile file) throws IllegalArgumentException, IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        // Validate file size
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 2 MB");
        }
        
        // Validate MIME type
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new IllegalArgumentException("Invalid file type. Allowed types: " + allowedTypes);
        }
        
        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Invalid file");
        }
        
        String fileExtension = getFileExtension(originalFilename);
        Set<String> allowedExtensions = new HashSet<>(Arrays.asList(allowedTypes.split(",")));
        if (!allowedExtensions.contains(fileExtension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file extension. Allowed: " + allowedTypes);
        }
        
        // Generate secure random filename
        String randomFileName = generateRandomFileName(fileExtension);
        
        // Create upload directory if it doesn't exist
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }
        
        // Save file
        Path filePath = Paths.get(uploadDir, randomFileName);
        Files.write(filePath, file.getBytes());
        
        return randomFileName;
    }
    
    public void deleteFile(String fileName) throws IOException {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }
        
        Path filePath = Paths.get(uploadDir, fileName);
        Files.deleteIfExists(filePath);
    }
    
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1) : "";
    }
    
    private String generateRandomFileName(String fileExtension) {
        SecureRandom random = new SecureRandom();
        byte[] values = new byte[16];
        random.nextBytes(values);
        
        StringBuilder sb = new StringBuilder();
        for (byte value : values) {
            sb.append(String.format("%02x", value));
        }
        
        return sb.toString() + "." + fileExtension;
    }
}
