package bookstore.xeadesta.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_IMAGE_TYPES =
        List.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private static final List<String> ALLOWED_BRANDING_TYPES =
        List.of("image/jpeg", "image/png", "image/webp", "image/x-icon");

    private static final long MAX_SIZE = 5L * 1024 * 1024; // 5 MB

    public String uploadBookCover(MultipartFile file) throws IOException {
        return upload(file, "books", ALLOWED_IMAGE_TYPES);
    }

    public String uploadBranding(MultipartFile file) throws IOException {
        return upload(file, "branding", ALLOWED_BRANDING_TYPES);
    }

    private String upload(MultipartFile file, String subDir, List<String> allowedTypes) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("File size must be less than 5 MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type: " + contentType);
        }

        String ext = getExtension(file.getOriginalFilename());
        String fileName = subDir + "/" + UUID.randomUUID() + "." + ext;

        Path dirPath = Paths.get(uploadDir, subDir).toAbsolutePath().normalize();
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(UUID.randomUUID() + "." + ext);
        fileName = subDir + "/" + filePath.getFileName().toString();

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
        }
        return fileName;
    }

    public void deleteFile(String fileName) throws IOException {
        if (fileName == null || fileName.isBlank()) return;
        Path path = Paths.get(uploadDir, fileName).toAbsolutePath().normalize();
        Files.deleteIfExists(path);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
