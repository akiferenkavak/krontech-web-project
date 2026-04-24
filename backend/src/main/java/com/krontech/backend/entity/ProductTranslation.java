package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "product_translations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "language_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Column(nullable = false)
    private String title;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String content;

    // SEO alanları
    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "og_title")
    private String ogTitle;

    @Column(name = "og_description", columnDefinition = "TEXT")
    private String ogDescription;

    @Column(name = "canonical_url")
    private String canonicalUrl;

    @Column(name = "index_page", nullable = false)
    private boolean indexPage = true;

    // GEO: schema.org structured data (JSON-LD string)
    @Column(name = "structured_data", columnDefinition = "TEXT")
    private String structuredData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContentStatus status = ContentStatus.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "how_it_works_content", columnDefinition = "TEXT")
    private String howItWorksContent;

    @Column(name = "key_benefits_content", columnDefinition = "TEXT")
    private String keyBenefitsContent;

    @Column(name = "product_family_content", columnDefinition = "TEXT")
    private String productFamilyContent;
}
