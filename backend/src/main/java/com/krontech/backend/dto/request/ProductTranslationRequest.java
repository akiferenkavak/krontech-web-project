package com.krontech.backend.dto.request;

import com.krontech.backend.entity.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductTranslationRequest(

        @NotNull(message = "Dil ID boş olamaz")
        UUID languageId,

        @NotBlank(message = "Başlık boş olamaz")
        String title,

        String shortDescription,
        String content,

        // SEO alanları
        String seoTitle,
        String seoDescription,
        String ogTitle,
        String ogDescription,
        String canonicalUrl,
        boolean indexPage,

        // GEO: JSON-LD string olarak gelir
        String structuredData,

        ContentStatus status,
        LocalDateTime scheduledAt
) {}
