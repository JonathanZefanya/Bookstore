package bookstore.xeadesta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Settings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column
    private String siteName;
    
    @Column
    private String siteLogo;
    
    @Column
    private String siteFavicon;
    
    @Column
    private String themeColor;
    
    @Column(columnDefinition = "LONGTEXT")
    private String footerText;
    
    @Column
    private String metaTitle;
    
    @Column(columnDefinition = "LONGTEXT")
    private String metaDescription;
    
    @Column(columnDefinition = "LONGTEXT")
    private String metaKeywords;
    
    @Column
    private String ogTitle;
    
    @Column(columnDefinition = "LONGTEXT")
    private String ogDescription;
    
    @Column
    private String ogImage;
    
    @Column
    private String canonicalUrl;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
