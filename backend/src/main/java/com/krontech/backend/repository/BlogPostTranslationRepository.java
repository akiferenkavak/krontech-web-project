package com.krontech.backend.repository;

import com.krontech.backend.entity.BlogPostTranslation;
import com.krontech.backend.entity.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogPostTranslationRepository extends JpaRepository<BlogPostTranslation, UUID> {

    Optional<BlogPostTranslation> findByBlogPostIdAndLanguageCode(UUID blogPostId, String languageCode);

    List<BlogPostTranslation> findByBlogPostIdAndStatus(UUID blogPostId, ContentStatus status);
}
