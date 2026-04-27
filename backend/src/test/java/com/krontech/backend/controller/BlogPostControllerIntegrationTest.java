package com.krontech.backend.controller;

import com.krontech.backend.dto.response.BlogPostDetailResponse;
import com.krontech.backend.dto.response.BlogPostSummaryResponse;
import com.krontech.backend.dto.response.PagedResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
@DisplayName("BlogPostController Integration Tests")
class BlogPostControllerIntegrationTest {

    @Container
    @SuppressWarnings("resource")
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("krontech_blog_test")
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

    @Test
    @DisplayName("GET /blog-posts - 200 ve PagedResponse döner")
    void getBlogPosts_returns200WithPagedResponse() {
        ResponseEntity<PagedResponse<BlogPostSummaryResponse>> response =
                restTemplate.exchange(
                        url("/api/v1/blog-posts?lang=en&page=0&size=10"),
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().content()).isNotNull();
        assertThat(response.getBody().page()).isEqualTo(0);
        assertThat(response.getBody().size()).isEqualTo(10);
    }

    @Test
    @DisplayName("GET /blog-posts - seed sonrası en az 1 yazı gelir")
    void getBlogPosts_afterDataInit_returnsAtLeastOnePost() {
        ResponseEntity<PagedResponse<BlogPostSummaryResponse>> response =
                restTemplate.exchange(
                        url("/api/v1/blog-posts?lang=en"),
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().content()).isNotEmpty();
    }

    @Test
    @DisplayName("GET /blog-posts/slug/zero-trust-mimarisi - seed yazısı gelir")
    void getBlogPostBySlug_withSeedSlug_returns200() {
        ResponseEntity<BlogPostDetailResponse> response = restTemplate.exchange(
                url("/api/v1/blog-posts/slug/zero-trust-mimarisi"),
                HttpMethod.GET,
                null,
                BlogPostDetailResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().slug()).isEqualTo("zero-trust-mimarisi");
        assertThat(response.getBody().translations()).isNotNull();
    }

    @Test
    @DisplayName("GET /blog-posts/slug/nonexistent - 404 döner")
    void getBlogPostBySlug_withInvalidSlug_returns404() {
        try {
            restTemplate.exchange(
                    url("/api/v1/blog-posts/slug/this-post-does-not-exist-xyz"),
                    HttpMethod.GET,
                    null,
                    String.class
            );
        } catch (org.springframework.web.client.HttpClientErrorException ex) {
            assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            return;
        }
        assertThat(false).isTrue();
    }

    @Test
    @DisplayName("GET /blog-posts/featured - öne çıkan yazılar gelir")
    void getFeaturedPosts_returns200() {
        ResponseEntity<List<BlogPostSummaryResponse>> response = restTemplate.exchange(
                url("/api/v1/blog-posts/featured?lang=en"),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    @DisplayName("GET /blog-posts - sayfalama parametreleri doğru çalışır")
    void getBlogPosts_withPaginationParams_returnsCorrectPageSize() {
        ResponseEntity<PagedResponse<BlogPostSummaryResponse>> response =
                restTemplate.exchange(
                        url("/api/v1/blog-posts?lang=en&page=0&size=3"),
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().size()).isEqualTo(3);
    }
}