package com.krontech.backend.controller;

import com.krontech.backend.dto.response.ResourceSummaryResponse;
import com.krontech.backend.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // GET /api/v1/resources?lang=tr
    // GET /api/v1/resources?lang=tr&type=datasheet
    @GetMapping
    public ResponseEntity<List<ResourceSummaryResponse>> getResources(
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(resourceService.getResources(lang, type));
    }
}