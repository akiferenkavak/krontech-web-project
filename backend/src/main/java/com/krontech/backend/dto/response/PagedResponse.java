package com.krontech.backend.dto.response;

import java.util.List;

// Sayfalanmış liste yanıtı için genel wrapper
public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}
