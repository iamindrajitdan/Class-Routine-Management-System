package com.crms.repository;

import com.crms.domain.Substitute;
import com.crms.domain.Routine;
import com.crms.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Substitute Repository
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
@Repository
public interface SubstituteRepository extends JpaRepository<Substitute, UUID> {

    List<Substitute> findByRoutine(Routine routine);

    List<Substitute> findByOriginalTeacher(Teacher teacher);

    List<Substitute> findBySubstitute(Teacher substitute);

    List<Substitute> findByStatus(Substitute.SubstituteStatus status);
}
