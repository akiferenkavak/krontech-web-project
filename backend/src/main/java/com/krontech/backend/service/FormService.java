package com.krontech.backend.service;

import com.krontech.backend.dto.request.FormSubmissionRequest;
import com.krontech.backend.dto.request.FormSubmissionStatusRequest;
import com.krontech.backend.dto.response.FormDefinitionResponse;
import com.krontech.backend.dto.response.FormSubmissionResponse;
import com.krontech.backend.dto.response.PagedResponse;
import com.krontech.backend.entity.FormDefinition;
import com.krontech.backend.entity.FormSubmission;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.FormDefinitionRepository;
import com.krontech.backend.repository.FormSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormDefinitionRepository formDefinitionRepository;
    private final FormSubmissionRepository formSubmissionRepository;

    // --- PUBLIC: Form tanımını slug ile getir (frontend form render için) ---
    @Transactional(readOnly = true)
    public FormDefinitionResponse getFormBySlug(String slug) {
        FormDefinition form = formDefinitionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Form bulunamadı! Slug: " + slug));

        if (!form.isActive()) {
            throw new IllegalStateException("Bu form şu an aktif değil.");
        }

        return mapToFormDefinitionResponse(form);
    }

    // --- PUBLIC: Form gönder (demo talep / iletişim) ---
    @Transactional
    public FormSubmissionResponse submitForm(
            FormSubmissionRequest request,
            String ipAddress,
            String userAgent) {

        FormDefinition form = formDefinitionRepository.findById(request.formDefinitionId())
                .orElseThrow(() -> new ResourceNotFoundException("Form bulunamadı! ID: " + request.formDefinitionId()));

        if (!form.isActive()) {
            throw new IllegalStateException("Bu form şu an aktif değil.");
        }

        FormSubmission submission = FormSubmission.builder()
                .formDefinition(form)
                .data(request.data())
                .status("new")
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .kvkkConsent(request.kvkkConsent())
                .build();

        return mapToSubmissionResponse(formSubmissionRepository.save(submission));
    }

    // --- ADMIN: Tüm form tanımlarını listele ---
    @Transactional(readOnly = true)
    public List<FormDefinitionResponse> getAllFormDefinitions() {
        return formDefinitionRepository.findAll()
                .stream()
                .map(this::mapToFormDefinitionResponse)
                .toList();
    }

    // --- ADMIN: Belirli bir formun gönderimlerini listele ---
    @Transactional(readOnly = true)
    public PagedResponse<FormSubmissionResponse> getSubmissions(
            UUID formDefinitionId, String status, int page, int size) {

        if (!formDefinitionRepository.existsById(formDefinitionId)) {
            throw new ResourceNotFoundException("Form bulunamadı! ID: " + formDefinitionId);
        }

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<FormSubmission> result = (status != null && !status.isBlank())
                ? formSubmissionRepository.findByFormDefinitionIdAndStatus(formDefinitionId, status, pageable)
                : formSubmissionRepository.findByFormDefinitionId(formDefinitionId, pageable);

        return new PagedResponse<>(
                result.getContent().stream().map(this::mapToSubmissionResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    // --- ADMIN: Tek bir gönderimi getir ve "read" olarak işaretle ---
    @Transactional
    public FormSubmissionResponse getSubmissionById(UUID id) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gönderim bulunamadı! ID: " + id));

        // Okundu olarak işaretle
        if ("new".equals(submission.getStatus())) {
            submission.setStatus("read");
            formSubmissionRepository.save(submission);
        }

        return mapToSubmissionResponse(submission);
    }

    // --- ADMIN: Gönderim durumunu güncelle ---
    @Transactional
    public FormSubmissionResponse updateSubmissionStatus(UUID id, FormSubmissionStatusRequest request) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gönderim bulunamadı! ID: " + id));

        submission.setStatus(request.status());
        return mapToSubmissionResponse(formSubmissionRepository.save(submission));
    }

    // --- ADMIN: Export — tüm kayıtları listele ve "exported" olarak işaretle ---
    @Transactional
    public List<FormSubmissionResponse> exportSubmissions(UUID formDefinitionId) {
        if (!formDefinitionRepository.existsById(formDefinitionId)) {
            throw new ResourceNotFoundException("Form bulunamadı! ID: " + formDefinitionId);
        }

        List<FormSubmission> submissions = formSubmissionRepository
                .findByFormDefinitionIdOrderByCreatedAtDesc(formDefinitionId);

        // Hepsini exported olarak işaretle
        submissions.forEach(s -> s.setStatus("exported"));
        formSubmissionRepository.saveAll(submissions);

        return submissions.stream().map(this::mapToSubmissionResponse).toList();
    }

    // --- ADMIN: Gönderimi sil ---
    @Transactional
    public void deleteSubmission(UUID id) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gönderim bulunamadı! ID: " + id));
        formSubmissionRepository.delete(submission);
    }

    // --- MAPPER'LAR ---

    private FormDefinitionResponse mapToFormDefinitionResponse(FormDefinition form) {
        long newCount = formSubmissionRepository.countNewByFormDefinitionId(form.getId());
        return new FormDefinitionResponse(
                form.getId(),
                form.getName(),
                form.getSlug(),
                form.getFieldsSchema(),
                form.isActive(),
                newCount
        );
    }

    private FormSubmissionResponse mapToSubmissionResponse(FormSubmission submission) {
        return new FormSubmissionResponse(
                submission.getId(),
                submission.getFormDefinition().getId(),
                submission.getFormDefinition().getName(),
                submission.getData(),
                submission.getStatus(),
                submission.getIpAddress(),
                submission.isKvkkConsent(),
                submission.getCreatedAt()
        );
    }
}
