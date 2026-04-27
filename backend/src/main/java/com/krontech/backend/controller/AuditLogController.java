package com.krontech.backend.controller;

import com.krontech.backend.entity.AuditLog;
import com.krontech.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<AuditLog> result;

        if (entityType != null && action != null) {
            result = auditLogRepository
                    .findByEntityTypeAndActionOrderByCreatedAtDesc(entityType, action, pageable);
        } else if (entityType != null) {
            result = auditLogRepository
                    .findByEntityTypeOrderByCreatedAtDesc(entityType, pageable);
        } else if (action != null) {
            result = auditLogRepository
                    .findByActionOrderByCreatedAtDesc(action, pageable);
        } else {
            result = auditLogRepository.findAll(pageable);
        }

        return ResponseEntity.ok(Map.of(
                "content",       result.getContent(),
                "page",          result.getNumber(),
                "size",          result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages",    result.getTotalPages(),
                "last",          result.isLast()
        ));
    }
}