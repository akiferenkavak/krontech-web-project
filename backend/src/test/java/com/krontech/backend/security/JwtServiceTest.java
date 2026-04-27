package com.krontech.backend.security;

import com.krontech.backend.config.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("JwtService Unit Tests")
class JwtServiceTest {

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private JwtService jwtService;

    private static final String VALID_SECRET =
            "test-secret-key-must-be-at-least-32-characters-long";

    @BeforeEach
    void setUp() {
        when(jwtProperties.getSecret()).thenReturn(VALID_SECRET);
        when(jwtProperties.getExpirationMs()).thenReturn(86400000L); // 24 saat
    }

    @Test
    @DisplayName("generateToken - token üretir ve email doğru extract edilir")
    void generateToken_andExtractEmail_roundTrip() {
        String token = jwtService.generateToken("admin@krontech.com", "ADMIN");

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractEmail(token)).isEqualTo("admin@krontech.com");
    }

    @Test
    @DisplayName("generateToken - token üretir ve role doğru extract edilir")
    void generateToken_andExtractRole_returnsCorrectRole() {
        String token = jwtService.generateToken("editor@krontech.com", "EDITOR");

        assertThat(jwtService.extractRole(token)).isEqualTo("EDITOR");
    }

    @Test
    @DisplayName("isTokenValid - geçerli token için true döner")
    void isTokenValid_withValidToken_returnsTrue() {
        String token = jwtService.generateToken("user@krontech.com", "ADMIN");

        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    @DisplayName("isTokenValid - bozuk token için false döner")
    void isTokenValid_withMalformedToken_returnsFalse() {
        assertThat(jwtService.isTokenValid("this.is.not.a.valid.jwt")).isFalse();
    }

    @Test
    @DisplayName("isTokenValid - boş string için false döner")
    void isTokenValid_withEmptyString_returnsFalse() {
        assertThat(jwtService.isTokenValid("")).isFalse();
    }

    @Test
    @DisplayName("isTokenValid - süresi dolmuş token için false döner")
    void isTokenValid_withExpiredToken_returnsFalse() {
        // expirationMs = -1000 → geçmişe ayarlı token
        when(jwtProperties.getExpirationMs()).thenReturn(-1000L);

        String expiredToken = jwtService.generateToken("user@test.com", "ADMIN");

        assertThat(jwtService.isTokenValid(expiredToken)).isFalse();
    }

    @Test
    @DisplayName("generateToken - farklı kullanıcılar için farklı tokenlar üretir")
    void generateToken_forDifferentUsers_producesDifferentTokens() {
        String token1 = jwtService.generateToken("user1@test.com", "ADMIN");
        String token2 = jwtService.generateToken("user2@test.com", "ADMIN");

        assertThat(token1).isNotEqualTo(token2);
    }
}