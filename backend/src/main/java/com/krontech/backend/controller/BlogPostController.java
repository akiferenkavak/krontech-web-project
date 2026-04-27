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

    @GetMapping
    public ResponseEntity<PagedResponse<BlogPostSummaryResponse>> getPublishedPosts(
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.getPublishedPosts(lang, page, size));
    }

    @GetMapping("/tag/{tagSlug}")
    public ResponseEntity<PagedResponse<BlogPostSummaryResponse>> getPostsByTag(
            @PathVariable String tagSlug,
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.getPostsByTag(tagSlug, lang, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDetailResponse> getPostById(@PathVariable UUID id) {
        return ResponseEntity.ok(blogPostService.getPostById(id));
    }

    // preview=true gelirse status filtresi uygulanmaz — DRAFT içerikler de döner
    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPostDetailResponse> getPostBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "false") boolean preview) {
        return ResponseEntity.ok(blogPostService.getPostBySlug(slug, preview));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<BlogPostSummaryResponse>> getFeaturedPosts(
            @RequestParam(defaultValue = "en") String lang) {
        return ResponseEntity.ok(blogPostService.getFeaturedPosts(lang));
    }

    // Admin — tüm postlar, tüm statuslar
    @GetMapping("/admin-list")
    public ResponseEntity<List<BlogPostDetailResponse>> getAllPostsForAdmin() {
        return ResponseEntity.ok(blogPostService.getAllPostsForAdmin());
    }

    @PostMapping
    public ResponseEntity<BlogPostDetailResponse> createPost(
            @Valid @RequestBody BlogPostCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogPostService.createPost(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDetailResponse> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody BlogPostCreateRequest request) {
        return ResponseEntity.ok(blogPostService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id) {
        blogPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/translations")
    public ResponseEntity<BlogPostDetailResponse> upsertTranslation(
            @PathVariable UUID id,
            @Valid @RequestBody BlogPostTranslationRequest request) {
        return ResponseEntity.ok(blogPostService.upsertTranslation(id, request));
    }

    @DeleteMapping("/{id}/translations/{translationId}")
    public ResponseEntity<Void> deleteTranslation(
            @PathVariable UUID id,
            @PathVariable UUID translationId) {
        blogPostService.deleteTranslation(id, translationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tags")
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return ResponseEntity.ok(blogPostService.getAllTags());
    }

    @PostMapping("/tags")
    public ResponseEntity<TagResponse> createTag(@RequestParam String slug) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogPostService.createTag(slug));
    }
}