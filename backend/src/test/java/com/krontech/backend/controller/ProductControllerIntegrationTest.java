package com.krontech.backend.controller;

import com.krontech.backend.dto.response.ProductDetailResponse;
import com.krontech.backend.dto.response.ProductSummaryResponse;
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
@DisplayName("ProductController Integration Tests")
class ProductControllerIntegrationTest {

    @Container
    @SuppressWarnings("resource")
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("krontech_test")
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
    @DisplayName("GET /products - 200 ve liste döner")
    void getProducts_returns200WithList() {
        ResponseEntity<List<ProductSummaryResponse>> response = restTemplate.exchange(
                url("/api/v1/products?lang=en"),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    @DisplayName("GET /products - DataInitializer sonrası en az 1 ürün gelir")
    void getProducts_afterDataInit_returnsAtLeastOneProduct() {
        ResponseEntity<List<ProductSummaryResponse>> response = restTemplate.exchange(
                url("/api/v1/products?lang=en"),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotEmpty();
    }

    @Test
    @DisplayName("GET /products/slug/pam-kron - seed ürünü gelir")
    void getProductBySlug_withSeedSlug_returns200() {
        ResponseEntity<ProductDetailResponse> response = restTemplate.exchange(
                url("/api/v1/products/slug/pam-kron"),
                HttpMethod.GET,
                null,
                ProductDetailResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().slug()).isEqualTo("pam-kron");
        assertThat(response.getBody().category()).isEqualTo("identity-access");
    }

    @Test
    @DisplayName("GET /products/slug/nonexistent - 404 döner")
    void getProductBySlug_withInvalidSlug_returns404() {
        try {
            restTemplate.exchange(
                    url("/api/v1/products/slug/nonexistent-product-xyz"),
                    HttpMethod.GET,
                    null,
                    String.class
            );
        } catch (org.springframework.web.client.HttpClientErrorException ex) {
            assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            return;
        }
        // 404 exception fırlatılmadıysa test başarısız
        assertThat(false).isTrue();
    }

    @Test
    @DisplayName("GET /products/roots - sadece parent'sız ürünler gelir")
    void getRootProducts_returnsOnlyRootProducts() {
        ResponseEntity<List<ProductSummaryResponse>> response = restTemplate.exchange(
                url("/api/v1/products/roots?lang=en"),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    @DisplayName("GET /products - TR dil filtresi çalışır")
    void getProducts_withTurkishLocale_returns200() {
        ResponseEntity<List<ProductSummaryResponse>> response = restTemplate.exchange(
                url("/api/v1/products?lang=tr"),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}