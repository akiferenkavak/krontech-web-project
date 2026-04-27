package com.krontech.backend.repository;

import com.krontech.backend.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    // Tek filtre: entityType
    Page<AuditLog> findByEntityTypeOrderByCreatedAtDesc(
            String entityType, Pageable pageable);

    // Tek filtre: action
    Page<AuditLog> findByActionOrderByCreatedAtDesc(
            String action, Pageable pageable);

    // Çift filtre: entityType + action
    Page<AuditLog> findByEntityTypeAndActionOrderByCreatedAtDesc(
            String entityType, String action, Pageable pageable);

    // Belirli bir kayıt için geçmiş (detay sayfasında kullanılabilir)
    Page<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
            String entityType, UUID entityId, Pageable pageable);
}