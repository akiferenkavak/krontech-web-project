package com.krontech.backend.repository;

import com.krontech.backend.entity.FormSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, UUID> {

    Page<FormSubmission> findByFormDefinitionId(UUID formDefinitionId, Pageable pageable);

    Page<FormSubmission> findByFormDefinitionIdAndStatus(
            UUID formDefinitionId, String status, Pageable pageable);

    // Export için tüm kayıtlar (sayfalama yok)
    List<FormSubmission> findByFormDefinitionIdOrderByCreatedAtDesc(UUID formDefinitionId);

    // Okunmamış sayısı — admin panel badge'i için
    @Query("SELECT COUNT(s) FROM FormSubmission s WHERE s.formDefinition.id = :formId AND s.status = 'new'")
    long countNewByFormDefinitionId(@Param("formId") UUID formId);
}
