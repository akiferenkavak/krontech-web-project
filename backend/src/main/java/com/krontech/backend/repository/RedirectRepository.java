package com.krontech.backend.repository;

import com.krontech.backend.entity.Redirect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RedirectRepository extends JpaRepository<Redirect, UUID> {

    Optional<Redirect> findByFromPathAndIsActiveTrue(String fromPath);

    boolean existsByFromPath(String fromPath);
}