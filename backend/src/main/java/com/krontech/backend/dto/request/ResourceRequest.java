package com.krontech.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public record ResourceRequest(

        @NotBlank
        @Pattern(regexp = "^[a-z0-9-]+$")
        String slug,

        @NotBlank
        String type,
        
        Boolean active,

        String featuredImageUrl,
        String fileUrl,
        String relatedProductSlug,

        List<TranslationData> translations
) {
    public record TranslationData(
            @NotBlank String languageCode,
            @NotBlank String title,
            String description
    ) {}
}