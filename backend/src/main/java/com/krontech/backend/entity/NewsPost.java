package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "news_posts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NewsPost extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String slug;

    // newsroom veya announcement
    @Column(nullable = false, length = 30)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "featured_image_id")
    private Media featuredImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @OneToMany(mappedBy = "newsPost", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NewsPostTranslation> translations = new ArrayList<>();
}
