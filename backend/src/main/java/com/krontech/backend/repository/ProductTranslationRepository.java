package com.krontech.backend.repository;

import com.krontech.backend.entity.ContentStatus;
import com.krontech.backend.entity.ProductTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductTranslationRepository extends JpaRepository<ProductTranslation, UUID> {

    Optional<ProductTranslation> findByProductIdAndLanguageCode(UUID productId, String languageCode);

    boolean existsByProductIdAndLanguageId(UUID productId, UUID languageId);

    List<ProductTranslation> findByProductIdAndStatus(UUID productId, ContentStatus status);
}
