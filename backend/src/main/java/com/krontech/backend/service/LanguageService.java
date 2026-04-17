package com.krontech.backend.service;

import com.krontech.backend.dto.request.LanguageCreateRequest;
import com.krontech.backend.dto.request.LanguageUpdateRequest;
import com.krontech.backend.dto.response.LanguageResponse;
import com.krontech.backend.entity.Language;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    // Tüm dilleri getir
    public List<LanguageResponse> getAllLanguages() {
        return languageRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Yeni dil ekle
    @Transactional
    public LanguageResponse createLanguage(LanguageCreateRequest request) {
        if (languageRepository.findByCode(request.code()).isPresent()) {
            throw new IllegalArgumentException("Bu dil kodu zaten kullanımda: " + request.code());
        }

        if (request.isDefault()) {
            removeCurrentDefaultLanguage();
        }

        Language language = Language.builder()
                .code(request.code())
                .name(request.name())
                .isDefault(request.isDefault())
                .build();

        Language savedLanguage = languageRepository.save(language);
        return mapToResponse(savedLanguage);
    }

    // Dili varsayılan yaparken arka planda çalışacak yardımcı metod
    private void removeCurrentDefaultLanguage() {
        languageRepository.findByIsDefaultTrue().ifPresent(currentDefault -> {
            currentDefault.setDefault(false);
            languageRepository.save(currentDefault);
        });
    }

    // ID'ye göre dil bul
    public LanguageResponse getLanguageById(UUID id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dil bulunamadı! ID: " + id));
        return mapToResponse(language);
    }

    // Dili Güncelle (Update)
    @Transactional
    public LanguageResponse updateLanguage(UUID id, LanguageUpdateRequest request) {
        Language existingLanguage = languageRepository.findById(id)
                // BURASI GÜNCELLENDİ
                .orElseThrow(() -> new ResourceNotFoundException("Güncellenecek dil bulunamadı! ID: " + id));

        if (!existingLanguage.getCode().equals(request.code()) &&
                languageRepository.findByCode(request.code()).isPresent()) {
            throw new IllegalArgumentException("Bu dil kodu başka bir dil tarafından kullanılıyor: " + request.code());
        }

        if (request.isDefault() && !existingLanguage.isDefault()) {
            removeCurrentDefaultLanguage();
        }

        existingLanguage.setCode(request.code());
        existingLanguage.setName(request.name());
        existingLanguage.setDefault(request.isDefault());

        Language updatedLanguage = languageRepository.save(existingLanguage);
        return mapToResponse(updatedLanguage);
    }

    // Dili Sil (Delete)
    @Transactional
    public void deleteLanguage(UUID id) {
        Language language = languageRepository.findById(id)
                // BURASI GÜNCELLENDİ
                .orElseThrow(() -> new ResourceNotFoundException("Silinecek dil bulunamadı! ID: " + id));

        if (language.isDefault()) {
            throw new IllegalStateException("Varsayılan dil silinemez! Önce başka bir dili varsayılan yapın.");
        }

        languageRepository.delete(language);
    }

    // --- YARDIMCI DÖNÜŞÜM METODU (MAPPER) ---
    private LanguageResponse mapToResponse(Language language) {
        return new LanguageResponse(
                language.getId(),
                language.getCode(),
                language.getName(),
                language.isDefault()
        );
    }
}