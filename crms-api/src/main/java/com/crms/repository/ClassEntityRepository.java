package com.crms.repository;

import com.crms.domain.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClassEntityRepository extends JpaRepository<ClassEntity, UUID> {
}
