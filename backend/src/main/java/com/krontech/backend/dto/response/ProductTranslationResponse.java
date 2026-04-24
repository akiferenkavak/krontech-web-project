package com.krontech.backend.dto.response;

import com.krontech.backend.entity.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductTranslationResponse(
        UUID id,
        String languageCode,
        String languageName,
        String title,
        String shortDescription,
        String content,
        String seoTitle,
        String seoDescription,
        String ogTitle,
        String ogDescription,
        String canonicalUrl,
        boolean indexPage,
        String structuredData,
        ContentStatus status,
        LocalDateTime publishedAt,
        LocalDateTime scheduledAt,
        String howItWorksContent,
        String keyBenefitsContent,
        String productFamilyContent
) {}
