package com.krontech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "form_submissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FormSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_definition_id", nullable = false)
    private FormDefinition formDefinition;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object data;

    // new, read, exported
    @Column(nullable = false, length = 20)
    private String status = "new";

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    // 1. Zorunlu KVKK onayı — kişisel verilerin işlenmesi
    @Column(name = "kvkk_consent", nullable = false)
    private boolean kvkkConsent = false;

    // 2. Opsiyonel pazarlama onayı — SMS/e-posta ticari ileti
    @Column(name = "marketing_consent", nullable = false)
    private boolean marketingConsent = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}