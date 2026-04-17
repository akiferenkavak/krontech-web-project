package com.krontech.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;
import java.util.UUID;

public record BlogPostCreateRequest(

        @NotBlank(message = "Slug boş olamaz")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug sadece küçük harf, rakam ve tire içerebilir")
        String slug,

        UUID authorId,
        UUID featuredImageId,

        // Tag slug listesi — ["pam", "cyber-security"] gibi
        List<String> tagSlugs
) {}
