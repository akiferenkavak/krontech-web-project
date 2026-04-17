package com.krontech.backend.controller;

import com.krontech.backend.dto.request.ProductCreateRequest;
import com.krontech.backend.dto.request.ProductTranslationRequest;
import com.krontech.backend.dto.response.ProductDetailResponse;
import com.krontech.backend.dto.response.ProductSummaryResponse;
import com.krontech.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Tüm ürünler (özet)
    @GetMapping
    public ResponseEntity<List<ProductSummaryResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Sadece üst seviye kategoriler
    @GetMapping("/roots")
    public ResponseEntity<List<ProductSummaryResponse>> getRootProducts() {
        return ResponseEntity.ok(productService.getRootProducts());
    }

    // Belirli bir ürünün alt ürünleri
    @GetMapping("/{id}/children")
    public ResponseEntity<List<ProductSummaryResponse>> getChildProducts(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getChildProducts(id));
    }

    // ID ile detay
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Slug ile detay (frontend SSR/ISR için asıl kullanılan)
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    // Yeni ürün oluştur
    @PostMapping
    public ResponseEntity<ProductDetailResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    // Ürün güncelle
    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    // Ürün sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Translation ekle veya güncelle (upsert)
    @PutMapping("/{id}/translations")
    public ResponseEntity<ProductDetailResponse> upsertTranslation(
            @PathVariable UUID id,
            @Valid @RequestBody ProductTranslationRequest request) {
        return ResponseEntity.ok(productService.upsertTranslation(id, request));
    }

    // Translation sil
    @DeleteMapping("/{id}/translations/{translationId}")
    public ResponseEntity<Void> deleteTranslation(
            @PathVariable UUID id,
            @PathVariable UUID translationId) {
        productService.deleteTranslation(id, translationId);
        return ResponseEntity.noContent().build();
    }
}
