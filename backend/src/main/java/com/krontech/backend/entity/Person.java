package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "persons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Person extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String slug;

    // management veya board-of-directors
    @Column(name = "role_type", nullable = false, length = 30)
    private String roleType;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id")
    private Media photo;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PersonTranslation> translations = new ArrayList<>();
}
