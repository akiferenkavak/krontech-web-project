package com.krontech.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RevalidationService {

    private final RestTemplate restTemplate;

    @Value("${app.frontend.url:http://frontend:3000}")
    private String frontendUrl;

    @Value("${app.revalidate.secret:krontech-revalidate-secret}")
    private String revalidateSecret;

    public void revalidateProduct(String slug) {
        triggerRevalidation("product", slug);
    }

    public void revalidateBlog(String slug) {
        triggerRevalidation("blog", slug);
    }

    public void revalidateAll() {
        triggerRevalidation("all", null);
    }

    private void triggerRevalidation(String type, String slug) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-revalidate-secret", revalidateSecret);

            Map<String, Object> body = slug != null
                    ? Map.of("type", type, "slug", slug)
                    : Map.of("type", type);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(
                    frontendUrl + "/api/revalidate",
                    entity,
                    String.class
            );

            log.debug("Revalidation triggered: type={}, slug={}", type, slug);
        } catch (Exception e) {
            // Revalidation başarısız olsa bile uygulama çalışmaya devam etmeli
            log.warn("Revalidation failed for type={}, slug={}: {}", type, slug, e.getMessage());
        }
    }
}