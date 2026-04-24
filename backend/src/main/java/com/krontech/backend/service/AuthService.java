package com.krontech.backend.service;

import com.krontech.backend.dto.request.LoginRequest;
import com.krontech.backend.dto.response.AuthResponse;
import com.krontech.backend.entity.User;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.UserRepository;
import com.krontech.backend.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    @Value("${app.cookie.max-age-seconds:86400}")
    private int cookieMaxAge;

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email veya şifre hatalı");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        // HttpOnly cookie — JS erişemez, XSS'e karşı korumalı
        Cookie cookie = new Cookie("admin_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);   // prod'da true, dev'de false
        cookie.setPath("/");
        cookie.setMaxAge(cookieMaxAge);   // default 24 saat
        // SameSite=Strict — CSRF'e karşı
        response.addHeader("Set-Cookie",
                String.format("admin_token=%s; HttpOnly; Path=/; Max-Age=%d; SameSite=Strict%s",
                        token, cookieMaxAge, cookieSecure ? "; Secure" : ""));

        return new AuthResponse(user.getEmail(), user.getRole().name());
    }

    public void logout(HttpServletResponse response) {
        // Cookie'yi sıfırla
        response.addHeader("Set-Cookie",
                "admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");
    }
}
