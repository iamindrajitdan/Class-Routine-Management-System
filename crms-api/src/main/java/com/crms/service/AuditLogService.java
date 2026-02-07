package com.crms.service;

import com.crms.domain.AuditLog;
import com.crms.domain.User;
import com.crms.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

/**
 * Audit Logging Service
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */
@Service
@Transactional
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void logAction(User user, String action, String resourceType, UUID resourceId, Object beforeState, Object afterState) {
        try {
            String beforeStateJson = beforeState != null ? objectMapper.writeValueAsString(beforeState) : null;
            String afterStateJson = afterState != null ? objectMapper.writeValueAsString(afterState) : null;

            String ipAddress = getClientIpAddress();

            AuditLog auditLog = new AuditLog(
                    user,
                    action,
                    resourceType,
                    resourceId,
                    beforeStateJson,
                    afterStateJson,
                    ipAddress
            );

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Error logging audit action: " + e.getMessage());
        }
    }

    public void logCreate(User user, String resourceType, UUID resourceId, Object newState) {
        logAction(user, "CREATE", resourceType, resourceId, null, newState);
    }

    public void logUpdate(User user, String resourceType, UUID resourceId, Object beforeState, Object afterState) {
        logAction(user, "UPDATE", resourceType, resourceId, beforeState, afterState);
    }

    public void logDelete(User user, String resourceType, UUID resourceId, Object deletedState) {
        logAction(user, "DELETE", resourceType, resourceId, deletedState, null);
    }

    public void logRead(User user, String resourceType, UUID resourceId) {
        logAction(user, "READ", resourceType, resourceId, null, null);
    }

    private String getClientIpAddress() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0];
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            // Ignore
        }
        return "UNKNOWN";
    }
}
