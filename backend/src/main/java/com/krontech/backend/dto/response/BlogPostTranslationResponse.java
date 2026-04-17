package com.krontech.backend.dto.response;

import com.krontech.backend.entity.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record BlogPostTranslationResponse(
        UUID id,
        String languageCode,
        String languageName,
        String title,
        String excerpt,
        String content,
        String seoTitle,
        String seoDescription,
        String structuredData,
        ContentStatus status,
        LocalDateTime publishedAt,
        LocalDateTime scheduledAt
) {}
