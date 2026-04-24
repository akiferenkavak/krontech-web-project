package com.krontech.backend.repository;

import com.krontech.backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    @Query("""
        SELECT r FROM Resource r
        LEFT JOIN FETCH r.translations t
        LEFT JOIN FETCH t.language
        LEFT JOIN FETCH r.relatedProduct
        WHERE r.isActive = true
        AND t.language.code = :langCode
        AND t.status = com.krontech.backend.entity.ContentStatus.PUBLISHED
        ORDER BY r.createdAt DESC
        """)
    List<Resource> findActiveByLanguage(@Param("langCode") String langCode);

    @Query("""
        SELECT r FROM Resource r
        LEFT JOIN FETCH r.translations t
        LEFT JOIN FETCH t.language
        LEFT JOIN FETCH r.relatedProduct
        WHERE r.isActive = true
        AND r.type = :type
        AND t.language.code = :langCode
        AND t.status = com.krontech.backend.entity.ContentStatus.PUBLISHED
        ORDER BY r.createdAt DESC
        """)
    List<Resource> findActiveByTypeAndLanguage(
        @Param("type") String type,
        @Param("langCode") String langCode
    );


    @Query("""
        SELECT r FROM Resource r
        LEFT JOIN FETCH r.translations t
        LEFT JOIN FETCH t.language
        LEFT JOIN FETCH r.relatedProduct
        LEFT JOIN FETCH r.featuredImage
        LEFT JOIN FETCH r.file
        ORDER BY r.createdAt DESC
        """)
    List<Resource> findAllWithTranslations();



}