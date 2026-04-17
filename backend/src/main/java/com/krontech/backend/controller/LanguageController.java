package com.krontech.backend.controller;

import com.krontech.backend.dto.request.LanguageCreateRequest;
import com.krontech.backend.dto.request.LanguageUpdateRequest;
import com.krontech.backend.dto.response.LanguageResponse;
import com.krontech.backend.service.LanguageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    // 1. Tüm dilleri listele (GET isteği)
    @GetMapping
    public ResponseEntity<List<LanguageResponse>> getAllLanguages() {
        return ResponseEntity.ok(languageService.getAllLanguages());
    }

    // 2. ID'ye göre tek bir dil getir (GET isteği)
    @GetMapping("/{id}")
    public ResponseEntity<LanguageResponse> getLanguageById(@PathVariable UUID id) {
        return ResponseEntity.ok(languageService.getLanguageById(id));
    }

    // 3. Yeni dil ekle (POST isteği)
    @PostMapping
    public ResponseEntity<LanguageResponse> createLanguage(@Valid @RequestBody LanguageCreateRequest request) {
        LanguageResponse createdLanguage = languageService.createLanguage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLanguage);
    }

    // 4. Dili güncelle (PUT isteği)
    @PutMapping("/{id}")
    public ResponseEntity<LanguageResponse> updateLanguage(
            @PathVariable UUID id,
            @Valid @RequestBody LanguageUpdateRequest request) {

        LanguageResponse updatedLanguage = languageService.updateLanguage(id, request);
        return ResponseEntity.ok(updatedLanguage);
    }

    // 5. Dili sil (DELETE isteği)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable UUID id) {
        languageService.deleteLanguage(id);
        return ResponseEntity.noContent().build(); // 204 No Content (Başarıyla silindi, dönecek veri yok)
    }
}