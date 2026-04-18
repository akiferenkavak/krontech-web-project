package com.krontech.backend.service;

import com.krontech.backend.dto.response.ResourceSummaryResponse;
import com.krontech.backend.entity.Resource;
import com.krontech.backend.entity.ResourceTranslation;
import com.krontech.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Transactional(readOnly = true)
    public List<ResourceSummaryResponse> getResources(String langCode, String type) {
        List<Resource> resources = (type != null && !type.isBlank())
                ? resourceRepository.findActiveByTypeAndLanguage(type, langCode)
                : resourceRepository.findActiveByLanguage(langCode);

        return resources.stream()
                .map(r -> mapToSummary(r, langCode))
                .toList();
    }

    private ResourceSummaryResponse mapToSummary(Resource resource, String langCode) {
        ResourceTranslation translation = resource.getTranslations().stream()
                .filter(t -> t.getLanguage().getCode().equals(langCode))
                .findFirst()
                .orElse(null);

        return new ResourceSummaryResponse(
                resource.getId(),
                resource.getSlug(),
                resource.getType(),
                translation != null ? translation.getTitle() : resource.getSlug(),
                translation != null ? translation.getDescription() : null,
                resource.getFile() != null ? resource.getFile().getUrl() : null,
                resource.getFeaturedImage() != null ? resource.getFeaturedImage().getUrl() : null,
                resource.getRelatedProduct() != null ? resource.getRelatedProduct().getSlug() : null,
                null // product title için ayrı translation fetch gerekir, şimdilik null
        );
    }
}