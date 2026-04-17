package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
    name = "solution_products",
    uniqueConstraints = @UniqueConstraint(columnNames = {"solution_id", "product_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SolutionProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_id", nullable = false)
    private Solution solution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}
