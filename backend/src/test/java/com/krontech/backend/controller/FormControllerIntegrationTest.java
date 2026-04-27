package com.krontech.backend.controller;

import com.krontech.backend.dto.response.FormDefinitionResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
@DisplayName("FormController Integration Tests")
class FormControllerIntegrationTest {

    @Container
    @SuppressWarnings("resource")
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("krontech_form_test")
                    .withUsername("test_user")
                    .withPassword("test_pass");

    @Container
    @SuppressWarnings("resource")
    static GenericContainer<?> redis =
            new GenericContainer<>("redis:7-alpine")
                    .withExposedPorts(6379);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port",
                () -> redis.getMappedPort(6379).toString());
        registry.add("spring.data.redis.password", () -> "");
    }

    @LocalServerPort
    private int port;

    private final RestTemplate restTemplate = new RestTemplate();

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    private HttpEntity<Map<String, Object>> jsonRequest(Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    @Test
    @DisplayName("GET /forms/contact - seed form tanımı gelir")
    void getFormBySlug_withContactSlug_returns200() {
        ResponseEntity<FormDefinitionResponse> response = restTemplate.exchange(
                url("/api/v1/forms/contact"),
                HttpMethod.GET,
                null,
                FormDefinitionResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().slug()).isEqualTo("contact");
        assertThat(response.getBody().fieldsSchema()).isNotNull();
    }

    @Test
    @DisplayName("GET /forms/nonexistent - 404 döner")
    void getFormBySlug_withInvalidSlug_returns404() {
        HttpClientErrorException ex = catchThrowableOfType(
                HttpClientErrorException.class,
                () -> restTemplate.exchange(
                        url("/api/v1/forms/nonexistent-form-xyz"),
                        HttpMethod.GET,
                        null,
                        String.class
                )
        );

        assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("POST /forms/submit - kvkkConsent false ile 400 döner")
    void submitForm_withKvkkConsentFalse_returns400() {
        Map<String, Object> body = Map.of(
                "formDefinitionId", UUID.randomUUID().toString(),
                "data", Map.of("email", "test@test.com"),
                "kvkkConsent", false,
                "marketingConsent", false,
                "recaptchaToken", "test-token"
        );

        HttpClientErrorException ex = catchThrowableOfType(
                HttpClientErrorException.class,
                () -> restTemplate.exchange(
                        url("/api/v1/forms/submit"),
                        HttpMethod.POST,
                        jsonRequest(body),
                        String.class
                )
        );

        assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("POST /forms/submit - recaptchaToken boş ile 400 döner")
    void submitForm_withBlankRecaptchaToken_returns400() {
        Map<String, Object> body = Map.of(
                "formDefinitionId", UUID.randomUUID().toString(),
                "data", Map.of("email", "test@test.com"),
                "kvkkConsent", true,
                "marketingConsent", false,
                "recaptchaToken", ""
        );

        HttpClientErrorException ex = catchThrowableOfType(
                HttpClientErrorException.class,
                () -> restTemplate.exchange(
                        url("/api/v1/forms/submit"),
                        HttpMethod.POST,
                        jsonRequest(body),
                        String.class
                )
        );

        assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("POST /forms/submit - formDefinitionId eksik ile 400 döner")
    void submitForm_withMissingFormId_returns400() {
        Map<String, Object> body = Map.of(
                "data", Map.of("email", "test@test.com"),
                "kvkkConsent", true,
                "marketingConsent", false,
                "recaptchaToken", "token"
        );

        HttpClientErrorException ex = catchThrowableOfType(
                HttpClientErrorException.class,
                () -> restTemplate.exchange(
                        url("/api/v1/forms/submit"),
                        HttpMethod.POST,
                        jsonRequest(body),
                        String.class
                )
        );

        assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}