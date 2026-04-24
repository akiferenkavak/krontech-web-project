package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "media")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Media extends BaseEntity {

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String url;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(name = "alt_text")
    private String altText;

    // STI — 'image', 'video', 'document'
    @Column(name = "media_type", length = 20)
    private String mediaType;

    // Video field'ları
    @Column(name = "embed_url")
    private String embedUrl;

    @Column(name = "platform", length = 50)
    private String platform;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    // Görsel field'ları
    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    // Ürün videoları için — null ise genel medya
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
}