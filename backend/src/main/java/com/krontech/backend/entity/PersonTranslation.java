package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
    name = "person_translations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"person_id", "language_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    // Dile göre değişebilen unvan: "CEO" vs "Genel Müdür"
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    // LinkedIn dile göre değişmez ama translation'da tutmak daha esnek
    @Column(name = "linkedin_url")
    private String linkedinUrl;
}
