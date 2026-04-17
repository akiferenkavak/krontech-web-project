package com.krontech.backend.controller;

import com.krontech.backend.dto.request.BlogPostCreateRequest;
import com.krontech.backend.dto.request.BlogPostTranslationRequest;
import com.krontech.backend.dto.response.*;
import com.krontech.backend.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/blog-posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    // Yayınlanmış yazılar — dil ve sayfalama ile
    // GET /api/v1/blog-posts?lang=en&page=0&size=10
    @GetMapping
    public ResponseEntity<PagedResponse<BlogPostSummaryResponse>> getPublishedPosts(
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.getPublishedPosts(lang, page, size));
    }

    // Tag'e göre filtreli liste
    // GET /api/v1/blog-posts/tag/pam?lang=en
    @GetMapping("/tag/{tagSlug}")
    public ResponseEntity<PagedResponse<BlogPostSummaryResponse>> getPostsByTag(
            @PathVariable String tagSlug,
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.getPostsByTag(tagSlug, lang, page, size));
    }

    // ID ile detay
    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDetailResponse> getPostById(@PathVariable UUID id) {
        return ResponseEntity.ok(blogPostService.getPostById(id));
    }

    // Slug ile detay (frontend SSR/ISR için)
    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPostDetailResponse> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogPostService.getPostBySlug(slug));
    }

    // Yeni post oluştur
    @PostMapping
    public ResponseEntity<BlogPostDetailResponse> createPost(
            @Valid @RequestBody BlogPostCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogPostService.createPost(request));
    }

    // Post güncelle
    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDetailResponse> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody BlogPostCreateRequest request) {
        return ResponseEntity.ok(blogPostService.updatePost(id, request));
    }

    // Post sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id) {
        blogPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Translation upsert
    @PutMapping("/{id}/translations")
    public ResponseEntity<BlogPostDetailResponse> upsertTranslation(
            @PathVariable UUID id,
            @Valid @RequestBody BlogPostTranslationRequest request) {
        return ResponseEntity.ok(blogPostService.upsertTranslation(id, request));
    }

    // Translation sil
    @DeleteMapping("/{id}/translations/{translationId}")
    public ResponseEntity<Void> deleteTranslation(
            @PathVariable UUID id,
            @PathVariable UUID translationId) {
        blogPostService.deleteTranslation(id, translationId);
        return ResponseEntity.noContent().build();
    }

    // --- Tag endpoint'leri ---

    @GetMapping("/tags")
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return ResponseEntity.ok(blogPostService.getAllTags());
    }

    @PostMapping("/tags")
    public ResponseEntity<TagResponse> createTag(@RequestParam String slug) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogPostService.createTag(slug));
    }
}
