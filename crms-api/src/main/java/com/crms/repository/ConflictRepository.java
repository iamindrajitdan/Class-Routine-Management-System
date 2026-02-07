package com.crms.repository;

import com.crms.domain.Conflict;
import com.crms.domain.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Conflict Repository
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
@Repository
public interface ConflictRepository extends JpaRepository<Conflict, UUID> {

    List<Conflict> findByRoutine(Routine routine);

    List<Conflict> findByStatus(Conflict.ConflictStatus status);

    List<Conflict> findByConflictType(Conflict.ConflictType conflictType);

    @Query("SELECT c FROM Conflict c WHERE c.status = 'DETECTED' ORDER BY c.severity DESC, c.createdAt DESC")
    List<Conflict> findUnresolvedConflicts();

    @Query("SELECT COUNT(c) FROM Conflict c WHERE c.status = 'DETECTED'")
    Long countUnresolvedConflicts();
}
