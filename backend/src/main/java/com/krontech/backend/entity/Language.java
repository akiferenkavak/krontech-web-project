package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "languages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 10)
    private String code; // Örn: "tr", "en", "en-US"

    @Column(nullable = false, length = 50)
    private String name; // Örn: "Türkçe", "English"

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;
}