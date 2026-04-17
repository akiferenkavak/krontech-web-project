package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "form_definitions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FormDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    // Formun alan yapısı: [{name, type, required, label_tr, label_en}, ...]
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "fields_schema", columnDefinition = "jsonb")
    private Object fieldsSchema;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
