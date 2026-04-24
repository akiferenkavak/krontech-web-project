package com.krontech.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductCreateRequest(

        @NotBlank(message = "Slug boş olamaz")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug sadece küçük harf, rakam ve tire içerebilir")
        String slug,

        @NotBlank(message = "Kategori boş olamaz")
        @Size(max = 50, message = "Kategori en fazla 50 karakter olabilir")
        String category,

        boolean isActive,

        Integer sortOrder,

        // Parent ürün ID'si — null ise üst seviye kategori
        java.util.UUID parentId,

        // Featured image ID'si — opsiyonel
        java.util.UUID featuredImageId,

        String bannerImageUrl
) {}
