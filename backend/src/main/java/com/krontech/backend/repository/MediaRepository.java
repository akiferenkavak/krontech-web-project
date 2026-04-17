package com.krontech.backend.repository;

import com.krontech.backend.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findByMimeTypeStartingWith(String mimeTypePrefix);

    boolean existsByUrl(String url);
}
