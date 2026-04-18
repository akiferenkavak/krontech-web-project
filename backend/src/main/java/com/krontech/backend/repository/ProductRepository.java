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

    // Sadece aktif, üst seviye ürünleri (kategori) getir
    List<Product> findByParentIsNullAndIsActiveTrue();

    // Belirli bir kategorinin aktif alt ürünlerini getir
    List<Product> findByParentIdAndIsActiveTrue(UUID parentId);

    // Kategori bazlı aktif ürünler
    List<Product> findByCategoryAndIsActiveTrue(String category);

    // Belirli bir ürünün tüm translation'larıyla birlikte getirilmesi (N+1 önleme)
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.translations t LEFT JOIN FETCH t.language WHERE p.slug = :slug")
    Optional<Product> findBySlugWithTranslations(@Param("slug") String slug);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.translations t LEFT JOIN FETCH t.language WHERE p.id = :id")
    Optional<Product> findByIdWithTranslations(@Param("id") UUID id);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.translations t LEFT JOIN FETCH t.language")
    List<Product> findAllWithTranslations();
}
