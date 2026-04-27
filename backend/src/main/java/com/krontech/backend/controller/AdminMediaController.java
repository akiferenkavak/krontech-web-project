// backend/src/main/java/com/krontech/backend/controller/AdminMediaController.java
package com.krontech.backend.controller;

import com.krontech.backend.entity.Media;
import com.krontech.backend.entity.User;
import com.krontech.backend.repository.MediaRepository;
import com.krontech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Media>> getAll() {
        return ResponseEntity.ok(mediaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Media> create(@RequestBody MediaCreateRequest request) {
        User admin = userRepository.findByEmail("admin@krontech.com")
                .orElse(userRepository.findAll().get(0));

        Media media = new Media();
        media.setUrl(request.url());
        media.setFilename(request.filename());
        media.setMimeType(request.mimeType() != null ? request.mimeType() : "image/jpeg");
        media.setAltText(request.altText());
        media.setUploadedBy(admin);

        return ResponseEntity.status(HttpStatus.CREATED).body(mediaRepository.save(media));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        mediaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record MediaCreateRequest(
        String url,
        String filename,
        String mimeType,
        String altText
    ) {}
}