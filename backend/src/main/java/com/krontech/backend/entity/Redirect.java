package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "redirects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Redirect {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "from_path", nullable = false, unique = true)
    private String fromPath;

    @Column(name = "to_path", nullable = false)
    private String toPath;

    // 301 veya 302
    @Column(name = "status_code", nullable = false)
    private Integer statusCode = 301;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
