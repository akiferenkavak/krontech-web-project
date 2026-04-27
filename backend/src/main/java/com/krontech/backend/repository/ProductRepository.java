package com.krontech.backend.repository;

import com.krontech.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Product> findByParentIsNullAndIsActiveTrue();

    List<Product> findByParentIdAndIsActiveTrue(UUID parentId);

    List<Product> findByCategoryAndIsActiveTrue(String category);

    // --- PUBLIC: sadece en az bir PUBLISHED translation'ı olan ürünleri döndürür ---
    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.translations t
        LEFT JOIN FETCH t.language
        WHERE p.slug = :slug
        AND EXISTS (
            SELECT 1 FROM ProductTranslation pt
            WHERE pt.product = p
            AND pt.status = com.krontech.backend.entity.ContentStatus.PUBLISHED
        )
        """)
    Optional<Product> findBySlugWithTranslations(@Param("slug") String slug);

    // --- PUBLIC: ID ile, sadece PUBLISHED translation'ı olanlar ---
    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.translations t
        LEFT JOIN FETCH t.language
        WHERE p.id = :id
        AND EXISTS (
            SELECT 1 FROM ProductTranslation pt
            WHERE pt.product = p
            AND pt.status = com.krontech.backend.entity.ContentStatus.PUBLISHED
        )
        """)
    Optional<Product> findByIdWithTranslations(@Param("id") UUID id);

    // --- ADMIN: status filtresi yok — tüm translation'lar gelir ---
    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.translations t
        LEFT JOIN FETCH t.language
        WHERE p.slug = :slug
        """)
    Optional<Product> findBySlugWithTranslationsForAdmin(@Param("slug") String slug);

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.translations t
        LEFT JOIN FETCH t.language
        WHERE p.id = :id
        """)
    Optional<Product> findByIdWithTranslationsForAdmin(@Param("id") UUID id);

    // --- ADMIN LIST: tüm ürünler, tüm statuslar ---
    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN FETCH p.translations t
        LEFT JOIN FETCH t.language
        LEFT JOIN FETCH p.featuredImage
        LEFT JOIN FETCH p.parent
        ORDER BY p.createdAt DESC
        """)
    List<Product> findAllWithDetailsForAdmin();

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.translations t
        LEFT JOIN FETCH t.language
        """)
    List<Product> findAllWithTranslations();
}