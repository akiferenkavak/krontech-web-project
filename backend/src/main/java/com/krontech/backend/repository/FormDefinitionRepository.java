package com.krontech.backend.repository;

import com.krontech.backend.entity.FormDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FormDefinitionRepository extends JpaRepository<FormDefinition, UUID> {

    Optional<FormDefinition> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
