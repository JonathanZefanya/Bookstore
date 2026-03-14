package bookstore.xeadesta.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column
    private String currency;

    @Column(columnDefinition = "TEXT")
    private String footerText;

    @Column
    private String metaTitle;

    @Column(columnDefinition = "TEXT")
    private String metaDescription;

    @Column(columnDefinition = "TEXT")
    private String metaKeywords;

    @Column
    private String ogTitle;

    @Column(columnDefinition = "TEXT")
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
