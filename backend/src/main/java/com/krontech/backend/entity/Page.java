package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Page extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String slug;

    // about-us, management, board-of-directors, careers, investor-relations vb.
    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "featured_image_id")
    private Media featuredImage;

    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PageTranslation> translations = new ArrayList<>();
}
