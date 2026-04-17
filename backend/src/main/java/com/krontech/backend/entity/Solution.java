package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solutions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Solution extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "featured_image_id")
    private Media featuredImage;

    @OneToMany(mappedBy = "solution", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SolutionTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "solution", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SolutionProduct> solutionProducts = new ArrayList<>();
}
