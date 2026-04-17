package com.krontech.backend.controller;

import com.krontech.backend.dto.request.FormSubmissionRequest;
import com.krontech.backend.dto.request.FormSubmissionStatusRequest;
import com.krontech.backend.dto.response.FormDefinitionResponse;
import com.krontech.backend.dto.response.FormSubmissionResponse;
import com.krontech.backend.dto.response.PagedResponse;
import com.krontech.backend.service.FormService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;

    // =============================================
    // PUBLIC ENDPOINTS (frontend tarafından kullanılır)
    // =============================================

    // Form yapısını getir — frontend dinamik form render için
    // GET /api/v1/forms/{slug}
    @GetMapping("/api/v1/forms/{slug}")
    public ResponseEntity<FormDefinitionResponse> getFormBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(formService.getFormBySlug(slug));
    }

    // Form gönder — demo talep / iletişim formu
    // POST /api/v1/forms/submit
    @PostMapping("/api/v1/forms/submit")
    public ResponseEntity<FormSubmissionResponse> submitForm(
            @Valid @RequestBody FormSubmissionRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(formService.submitForm(request, ipAddress, userAgent));
    }

    // =============================================
    // ADMIN ENDPOINTS
    // =============================================

    // Tüm form tanımlarını listele
    // GET /api/v1/admin/forms
    @GetMapping("/api/v1/admin/forms")
    public ResponseEntity<List<FormDefinitionResponse>> getAllFormDefinitions() {
        return ResponseEntity.ok(formService.getAllFormDefinitions());
    }

    // Belirli bir formun gönderimlerini listele
    // GET /api/v1/admin/forms/{formId}/submissions?status=new&page=0&size=20
    @GetMapping("/api/v1/admin/forms/{formId}/submissions")
    public ResponseEntity<PagedResponse<FormSubmissionResponse>> getSubmissions(
            @PathVariable UUID formId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(formService.getSubmissions(formId, status, page, size));
    }

    // Tek bir gönderimi getir (otomatik "read" olarak işaretler)
    // GET /api/v1/admin/submissions/{id}
    @GetMapping("/api/v1/admin/submissions/{id}")
    public ResponseEntity<FormSubmissionResponse> getSubmissionById(@PathVariable UUID id) {
        return ResponseEntity.ok(formService.getSubmissionById(id));
    }

    // Gönderim durumunu güncelle
    // PATCH /api/v1/admin/submissions/{id}/status
    @PatchMapping("/api/v1/admin/submissions/{id}/status")
    public ResponseEntity<FormSubmissionResponse> updateSubmissionStatus(
            @PathVariable UUID id,
            @Valid @RequestBody FormSubmissionStatusRequest request) {
        return ResponseEntity.ok(formService.updateSubmissionStatus(id, request));
    }

    // Export — tüm kayıtları al ve exported olarak işaretle
    // GET /api/v1/admin/forms/{formId}/submissions/export
    @GetMapping("/api/v1/admin/forms/{formId}/submissions/export")
    public ResponseEntity<List<FormSubmissionResponse>> exportSubmissions(@PathVariable UUID formId) {
        return ResponseEntity.ok(formService.exportSubmissions(formId));
    }

    // Gönderimi sil
    // DELETE /api/v1/admin/submissions/{id}
    @DeleteMapping("/api/v1/admin/submissions/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable UUID id) {
        formService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }

    // --- YARDIMCI: Gerçek IP adresini al (proxy arkasında da çalışır) ---
    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
