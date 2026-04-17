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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
}
