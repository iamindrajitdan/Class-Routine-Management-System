package com.crms.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting Filter using Token Bucket algorithm
 * Requirements: 13.6
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${crms.rate-limit.enabled:true}")
    private boolean rateLimitEnabled;

    @Value("${crms.rate-limit.requests-per-minute:100}")
    private int requestsPerMinute;

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (!rateLimitEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientId = getClientId(request);
        Bucket bucket = resolveBucket(clientId);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
            response.setContentType("application/json");
        }
    }

    private Bucket resolveBucket(String clientId) {
        return cache.computeIfAbsent(clientId, k -> createNewBucket());
    }

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(requestsPerMinute, Refill.intervally(requestsPerMinute, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private String getClientId(HttpServletRequest request) {
        String clientId = request.getHeader("X-Forwarded-For");
        if (clientId == null || clientId.isEmpty()) {
            clientId = request.getRemoteAddr();
        }
        return clientId;
    }
}
