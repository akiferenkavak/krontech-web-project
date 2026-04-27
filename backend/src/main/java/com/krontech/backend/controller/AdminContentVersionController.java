// backend/src/main/java/com/krontech/backend/controller/AdminContentVersionController.java
package com.krontech.backend.controller;

import com.krontech.backend.entity.AuditLog;
import com.krontech.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/versions")
@RequiredArgsConstructor
public class AdminContentVersionController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping("/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLog>> getVersionHistory(
            @PathVariable String entityType,
            @PathVariable UUID entityId,
            @RequestParam(defaultValue = "20") int limit) {

        PageRequest pageable = PageRequest.of(0, limit,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        return ResponseEntity.ok(
                auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
                        entityType, entityId, pageable).getContent()
        );
    }
}