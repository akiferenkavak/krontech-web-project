package com.krontech.backend.repository;

import com.krontech.backend.entity.BlogPost;
import com.krontech.backend.entity.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {

    boolean existsBySlug(String slug);

    // Slug ile detay — translations + language + tags + author tek sorguda
    @Query("""
        SELECT DISTINCT b FROM BlogPost b
        LEFT JOIN FETCH b.translations t
        LEFT JOIN FETCH t.language
        LEFT JOIN FETCH b.author
        LEFT JOIN FETCH b.featuredImage
        WHERE b.slug = :slug
        """)
    Optional<BlogPost> findBySlugWithDetails(@Param("slug") String slug);

    @Query("""
        SELECT DISTINCT b FROM BlogPost b
        LEFT JOIN FETCH b.translations t
        LEFT JOIN FETCH t.language
        LEFT JOIN FETCH b.author
        LEFT JOIN FETCH b.featuredImage
        WHERE b.id = :id
        """)
    Optional<BlogPost> findByIdWithDetails(@Param("id") UUID id);

    // Liste için sayfalanmış sorgu — sadece belirli dil + status filtresiyle
    // tags ayrı çekilir, bu sorgu summary için yeterli
    @Query("""
        SELECT b FROM BlogPost b
        LEFT JOIN FETCH b.featuredImage
        LEFT JOIN FETCH b.author
        LEFT JOIN b.translations t
        WHERE t.language.code = :langCode
        AND t.status = :status
        ORDER BY b.createdAt DESC
        """)
    Page<BlogPost> findPublishedByLanguage(
        @Param("langCode") String langCode,
        @Param("status") ContentStatus status,
        Pageable pageable
    );

    // Tag'e göre filtreleme
    @Query("""
        SELECT DISTINCT b FROM BlogPost b
        LEFT JOIN FETCH b.featuredImage
        LEFT JOIN b.tags tag
        LEFT JOIN b.translations t
        WHERE tag.slug = :tagSlug
        AND t.language.code = :langCode
        AND t.status = :status
        ORDER BY b.createdAt DESC
        """)
    Page<BlogPost> findByTagSlugAndLanguage(
        @Param("tagSlug") String tagSlug,
        @Param("langCode") String langCode,
        @Param("status") ContentStatus status,
        Pageable pageable
    );

    @Query("""
    SELECT b FROM BlogPost b
    LEFT JOIN FETCH b.featuredImage
    LEFT JOIN b.translations t
    WHERE b.featured = true
    AND t.language.code = :langCode
    AND t.status = com.krontech.backend.entity.ContentStatus.PUBLISHED
    ORDER BY b.createdAt DESC
    """)
    List<BlogPost> findFeaturedByLanguage(@Param("langCode") String langCode);

}
