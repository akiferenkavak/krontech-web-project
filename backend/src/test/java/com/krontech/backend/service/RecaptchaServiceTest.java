package com.krontech.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("RecaptchaService Unit Tests")
class RecaptchaServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RecaptchaService recaptchaService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(recaptchaService, "secretKey", "test-secret-key");
    }

    @Test
    @DisplayName("verify - null token false döner")
    void verify_withNullToken_returnsFalse() {
        assertThat(recaptchaService.verify(null)).isFalse();
    }

    @Test
    @DisplayName("verify - boş string false döner")
    void verify_withBlankToken_returnsFalse() {
        assertThat(recaptchaService.verify("   ")).isFalse();
    }

    @Test
    @DisplayName("verify - Google success:true döndürünce true gelir")
    @SuppressWarnings("unchecked")
    void verify_whenGoogleReturnsSuccess_returnsTrue() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(Map.of("success", true));

        assertThat(recaptchaService.verify("valid-recaptcha-token")).isTrue();
    }

    @Test
    @DisplayName("verify - Google success:false döndürünce false gelir")
    @SuppressWarnings("unchecked")
    void verify_whenGoogleReturnsFailure_returnsFalse() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(Map.of(
                        "success", false,
                        "error-codes", new String[]{"invalid-input-response"}
                ));

        assertThat(recaptchaService.verify("invalid-token")).isFalse();
    }

    @Test
    @DisplayName("verify - Google null döndürünce false gelir")
    @SuppressWarnings("unchecked")
    void verify_whenGoogleReturnsNull_returnsFalse() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(null);

        assertThat(recaptchaService.verify("some-token")).isFalse();
    }

    @Test
    @DisplayName("verify - ağ hatası olduğunda false döner")
    @SuppressWarnings("unchecked")
    void verify_whenNetworkError_returnsFalse() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenThrow(new RestClientException("Connection refused"));

        assertThat(recaptchaService.verify("any-token")).isFalse();
    }
}