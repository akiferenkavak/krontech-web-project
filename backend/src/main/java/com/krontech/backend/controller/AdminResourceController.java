package com.krontech.backend.controller;

import com.krontech.backend.dto.request.ResourceRequest;
import com.krontech.backend.dto.response.ResourceSummaryResponse;
import com.krontech.backend.entity.*;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/resources")
@RequiredArgsConstructor
public class AdminResourceController {

    private final ResourceRepository resourceRepository;
    private final ResourceTranslationRepository resourceTranslationRepository;
    private final ProductRepository productRepository;
    private final LanguageRepository languageRepository;
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

@GetMapping
@Transactional
public ResponseEntity<List<ResourceSummaryResponse>> getAll() {
    List<Resource> resources = resourceRepository.findAll();
    System.out.println("Total resources in DB: " + resources.size());
    resources.forEach(r -> System.out.println("Resource: " + r.getSlug() + " active: " + r.isActive()));
    return ResponseEntity.ok(resources.stream().map(this::mapToSummary).toList());
}

    @GetMapping("/{id}")
public ResponseEntity<ResourceSummaryResponse> getById(@PathVariable UUID id) {
    Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    return ResponseEntity.ok(mapToSummary(resource));
}

    @PostMapping
    public ResponseEntity<ResourceSummaryResponse> create(@Valid @RequestBody ResourceRequest request) {
        Resource resource = new Resource();
        applyRequest(resource, request);
        resource = resourceRepository.save(resource);
        applyTranslations(resource, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToSummary(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceSummaryResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        applyRequest(resource, request);
        resource = resourceRepository.save(resource);
        applyTranslations(resource, request);
        return ResponseEntity.ok(mapToSummary(resource));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        resourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Resource resource, ResourceRequest request) {
        resource.setSlug(request.slug());
        resource.setType(request.type());
        resource.setActive(request.active() != null ? request.active() : true);

        if (request.relatedProductSlug() != null) {
            productRepository.findBySlug(request.relatedProductSlug())
                    .ifPresent(resource::setRelatedProduct);
        } else {
            resource.setRelatedProduct(null);
        }

        // featuredImageUrl → Media kaydı oluştur
        if (request.featuredImageUrl() != null && !request.featuredImageUrl().isBlank()) {
            Media media = new Media();
            media.setUrl(request.featuredImageUrl());
            media.setFilename(request.slug() + "-thumb");
            media.setMimeType("image/jpeg");
            User admin = userRepository.findByEmail("admin@krontech.com")
                    .orElse(userRepository.findAll().get(0));
            media.setUploadedBy(admin);
            media = mediaRepository.save(media);
            resource.setFeaturedImage(media);
        }

        // fileUrl → Media kaydı oluştur
        if (request.fileUrl() != null && !request.fileUrl().isBlank()) {
            Media file = new Media();
            file.setUrl(request.fileUrl());
            file.setFilename(request.slug() + "-file");
            file.setMimeType("application/pdf");
            User admin = userRepository.findByEmail("admin@krontech.com")
                    .orElse(userRepository.findAll().get(0));
            file.setUploadedBy(admin);
            file = mediaRepository.save(file);
            resource.setFile(file);
        }
    }

    private void applyTranslations(Resource resource, ResourceRequest request) {
        if (request.translations() == null) return;
        for (ResourceRequest.TranslationData td : request.translations()) {
            Language lang = languageRepository.findByCode(td.languageCode()).orElse(null);
            if (lang == null) continue;

            ResourceTranslation tr = resource.getTranslations().stream()
                    .filter(t -> t.getLanguage().getCode().equals(td.languageCode()))
                    .findFirst()
                    .orElse(new ResourceTranslation());

            tr.setResource(resource);
            tr.setLanguage(lang);
            tr.setTitle(td.title());
            tr.setDescription(td.description());
            tr.setStatus(ContentStatus.PUBLISHED);
            tr.setPublishedAt(LocalDateTime.now());
            resourceTranslationRepository.save(tr);
        }
    }

    private ResourceSummaryResponse mapToSummary(Resource resource) {
        ResourceTranslation tr = resource.getTranslations().stream()
                .filter(t -> t.getLanguage().getCode().equals("en"))
                .findFirst().orElse(null);
        return new ResourceSummaryResponse(
                resource.getId(),
                resource.getSlug(),
                resource.getType(),
                resource.isActive(),
                tr != null ? tr.getTitle() : resource.getSlug(),
                tr != null ? tr.getDescription() : null,
                resource.getFile() != null ? resource.getFile().getUrl() : null,
                resource.getFeaturedImage() != null ? resource.getFeaturedImage().getUrl() : null,
                resource.getRelatedProduct() != null ? resource.getRelatedProduct().getSlug() : null,
                null
        );
    }
}