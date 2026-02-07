package com.crms.repository;

import com.crms.domain.AuditLog;
import com.crms.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * AuditLog Repository
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findByUser(User user, Pageable pageable);

    Page<AuditLog> findByAction(String action, Pageable pageable);

    Page<AuditLog> findByResourceType(String resourceType, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.resourceType = :resourceType AND a.resourceId = :resourceId ORDER BY a.timestamp DESC")
    List<AuditLog> findByResourceTypeAndResourceId(
            @Param("resourceType") String resourceType,
            @Param("resourceId") UUID resourceId
    );

    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    List<AuditLog> findByTimestampBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM AuditLog a WHERE a.user = :user AND a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    List<AuditLog> findByUserAndTimestampBetween(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
