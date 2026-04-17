package com.krontech.backend.repository;

import com.krontech.backend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

    Optional<Tag> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.translations tr LEFT JOIN FETCH tr.language")
    List<Tag> findAllWithTranslations();
}
