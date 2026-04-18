package com.krontech.backend.repository;

import com.krontech.backend.entity.ResourceTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceTranslationRepository extends JpaRepository<ResourceTranslation, UUID> {
    Optional<ResourceTranslation> findByResourceIdAndLanguageCode(UUID resourceId, String languageCode);
}