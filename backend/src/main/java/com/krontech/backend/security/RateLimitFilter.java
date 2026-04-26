package com.krontech.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final LettuceBasedProxyManager<String> proxyManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String ip = getClientIp(request);
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Actuator ve static asset'leri atla
        if (path.startsWith("/actuator") || path.startsWith("/_next")) {
            filterChain.doFilter(request, response);
            return;
        }

        String bucketKey;
        Supplier<BucketConfiguration> configSupplier;

        // 1. Login brute force koruması — 5 istek / 15 dakika
        if (path.equals("/api/v1/auth/login") && method.equals("POST")) {
            bucketKey = "login:" + ip;
            configSupplier = () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(10)
                            .refillIntervally(10, Duration.ofMinutes(5))
                            .build())
                    .build();
        }
        // 2. Form submit spam koruması — 3 istek / dakika
        else if (path.equals("/api/v1/forms/submit") && method.equals("POST")) {
            bucketKey = "form:" + ip;
            configSupplier = () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(5)
                            .refillIntervally(5, Duration.ofMinutes(15))
                            .build())
                    .build();
        }
        // 3. Genel API — 100 istek / dakika
        else if (path.startsWith("/api/v1/")) {
            bucketKey = "api:" + ip;
            configSupplier = () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(300)
                            .refillIntervally(300, Duration.ofMinutes(1))
                            .build())
                    .build();
        }
        // Rate limit uygulanmayan path
        else {
            filterChain.doFilter(request, response);
            return;
        }

        Bucket bucket = proxyManager.builder().build(bucketKey, configSupplier);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining",
                    String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long retryAfterSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.addHeader("X-Rate-Limit-Remaining", "0");
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            String body = objectMapper.writeValueAsString(Map.of(
                    "status", 429,
                    "error", "Too Many Requests",
                    "message", "Rate limit exceeded. Try again in " + retryAfterSeconds + " seconds.",
                    "retryAfter", retryAfterSeconds
            ));
            response.getWriter().write(body);

            log.warn("Rate limit exceeded — ip={}, path={}", ip, path);
        }
    }

    /**
     * Gerçek IP'yi çeker — proxy/load balancer arkasında da çalışır.
     */
    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        return request.getRemoteAddr();
    }
}