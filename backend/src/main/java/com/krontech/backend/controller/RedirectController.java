package com.krontech.backend.controller;

import com.krontech.backend.entity.Redirect;
import com.krontech.backend.repository.RedirectRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/redirects")
@RequiredArgsConstructor
public class RedirectController {

    private final RedirectRepository redirectRepository;

    // DTO
    public record RedirectRequest(
        @NotBlank String fromPath,
        @NotBlank String toPath,
        @Pattern(regexp = "301|302") String statusCode,
        Boolean isActive
    ) {}

    public record RedirectResponse(
        UUID id,
        String fromPath,
        String toPath,
        Integer statusCode,
        boolean isActive,
        String createdAt
    ) {}

    // LIST
    @GetMapping
    public ResponseEntity<List<RedirectResponse>> getAll() {
        return ResponseEntity.ok(
            redirectRepository.findAll().stream()
                .map(this::toResponse)
                .toList()
        );
    }

    // CREATE
    @PostMapping
    public ResponseEntity<RedirectResponse> create(@Valid @RequestBody RedirectRequest req) {
        if (redirectRepository.existsByFromPath(req.fromPath())) {
            throw new IllegalArgumentException("Bu fromPath zaten mevcut: " + req.fromPath());
        }

        Redirect redirect = Redirect.builder()
            .fromPath(req.fromPath())
            .toPath(req.toPath())
            .statusCode(req.statusCode() != null ? Integer.parseInt(req.statusCode()) : 301)
            .isActive(req.isActive() != null ? req.isActive() : true)
            .build();

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(toResponse(redirectRepository.save(redirect)));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<RedirectResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody RedirectRequest req) {

        Redirect redirect = redirectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Redirect bulunamadı: " + id));

        redirect.setFromPath(req.fromPath());
        redirect.setToPath(req.toPath());
        redirect.setStatusCode(req.statusCode() != null ? Integer.parseInt(req.statusCode()) : 301);
        redirect.setActive(req.isActive() != null ? req.isActive() : redirect.isActive());

        return ResponseEntity.ok(toResponse(redirectRepository.save(redirect)));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        redirectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // TOGGLE active
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<RedirectResponse> toggle(@PathVariable UUID id) {
        Redirect redirect = redirectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Redirect bulunamadı: " + id));
        redirect.setActive(!redirect.isActive());
        return ResponseEntity.ok(toResponse(redirectRepository.save(redirect)));
    }

    private RedirectResponse toResponse(Redirect r) {
        return new RedirectResponse(
            r.getId(),
            r.getFromPath(),
            r.getToPath(),
            r.getStatusCode(),
            r.isActive(),
            r.getCreatedAt() != null ? r.getCreatedAt().toString() : null
        );
    }
}