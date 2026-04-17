package com.krontech.backend.repository;

import com.krontech.backend.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LanguageRepository extends JpaRepository<Language, UUID> {

    Optional<Language> findByCode(String code);

    // Varsayılan dili bulmak için özel bir metod
    Optional<Language> findByIsDefaultTrue();
}