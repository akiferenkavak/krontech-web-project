package com.krontech.backend.service;

import com.krontech.backend.dto.request.LanguageCreateRequest;
import com.krontech.backend.dto.request.LanguageUpdateRequest;
import com.krontech.backend.dto.response.LanguageResponse;
import com.krontech.backend.entity.Language;
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

    // Tüm dilleri getir (Artık Entity değil, Response DTO dönüyor)
    public List<LanguageResponse> getAllLanguages() {
        return languageRepository.findAll()
                .stream()
                .map(this::mapToResponse) // Her bir Entity'yi DTO'ya çevir
                .collect(Collectors.toList());
    }

    // Yeni dil ekle (Artık Entity değil, Request DTO alıyor)
    @Transactional
    public LanguageResponse createLanguage(LanguageCreateRequest request) {
        // 1. İş Kuralı: Bu dil kodu zaten var mı?
        if (languageRepository.findByCode(request.code()).isPresent()) {
            throw new IllegalArgumentException("Bu dil kodu zaten kullanımda: " + request.code());
        }

        // 2. İş Kuralı: Eğer bu dil varsayılan (default) olarak ekleniyorsa, diğerinin default özelliğini kaldır
        if (request.isDefault()) {
            removeCurrentDefaultLanguage();
        }

        // DTO'yu Entity'ye çevir ve kaydet
        Language language = Language.builder()
                .code(request.code())
                .name(request.name())
                .isDefault(request.isDefault())
                .build();

        Language savedLanguage = languageRepository.save(language);

        // Kaydedilen Entity'yi Response DTO'ya çevirip döndür
        return mapToResponse(savedLanguage);
    }

    // Dili varsayılan yaparken arka planda çalışacak yardımcı metod
    private void removeCurrentDefaultLanguage() {
        languageRepository.findByIsDefaultTrue().ifPresent(currentDefault -> {
            currentDefault.setDefault(false);
            languageRepository.save(currentDefault);
        });
    }

    // ID'ye göre dil bul (Response DTO döner)
    public LanguageResponse getLanguageById(UUID id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dil bulunamadı! ID: " + id));
        return mapToResponse(language);
    }

    // Dili Güncelle (Update)
    @Transactional
    public LanguageResponse updateLanguage(UUID id, LanguageUpdateRequest request) {
        Language existingLanguage = languageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Güncellenecek dil bulunamadı! ID: " + id));

        // İş Kuralı: Eğer dil kodu değişiyorsa ve yeni kod başka bir dilde kullanılıyorsa hata ver
        if (!existingLanguage.getCode().equals(request.code()) &&
                languageRepository.findByCode(request.code()).isPresent()) {
            throw new IllegalArgumentException("Bu dil kodu başka bir dil tarafından kullanılıyor: " + request.code());
        }

        // İş Kuralı: Eğer bu dil varsayılan yapılıyorsa, mevcut varsayılanı kaldır
        if (request.isDefault() && !existingLanguage.isDefault()) {
            removeCurrentDefaultLanguage();
        }

        // Verileri güncelle
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
                .orElseThrow(() -> new IllegalArgumentException("Silinecek dil bulunamadı! ID: " + id));

        // ÖNEMLİ: Varsayılan dili silmeyi engelleyebiliriz (Sistem çökmesin diye)
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