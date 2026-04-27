package com.krontech.backend.service;

import com.krontech.backend.entity.AuditLog;
import com.krontech.backend.entity.User;
import com.krontech.backend.repository.AuditLogRepository;
import com.krontech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    /**
     * Bir CRUD işlemini audit log'a kaydeder.
     *
     * @param entityType  "BlogPost", "Product", "Resource" vb.
     * @param entityId    İşleme konu olan kayıt ID'si
     * @param action      "CREATE", "UPDATE", "DELETE", "PUBLISH"
     * @param oldValue    Değişiklik öncesi durum (null olabilir)
     * @param newValue    Değişiklik sonrası durum (null olabilir)
     */
    public void log(String entityType,
                    UUID entityId,
                    String action,
                    Object oldValue,
                    Object newValue) {
        try {
            User currentUser = resolveCurrentUser();

            AuditLog entry = AuditLog.builder()
                    .user(currentUser)
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .build();

            auditLogRepository.save(entry);

            log.debug("[AuditLog] action={} entityType={} entityId={} user={}",
                      action, entityType, entityId,
                      currentUser != null ? currentUser.getEmail() : "system");

        } catch (Exception e) {
            // Audit log hatası ana işlemi durdurmamalı
            log.warn("[AuditLog] Kayıt sırasında hata: action={} entityType={} entityId={} error={}",
                     action, entityType, entityId, e.getMessage());
        }
    }

    /** Convenience — oldValue olmadan */
    public void log(String entityType, UUID entityId, String action, Object newValue) {
        log(entityType, entityId, action, null, newValue);
    }

    /** Convenience — sadece action */
    public void log(String entityType, UUID entityId, String action) {
        log(entityType, entityId, action, null, null);
    }

    // ----- private helpers -----

    private User resolveCurrentUser() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) return null;
            String email = auth.getName();
            return userRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
}