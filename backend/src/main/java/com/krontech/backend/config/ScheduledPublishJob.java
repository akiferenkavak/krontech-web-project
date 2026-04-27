package com.krontech.backend.config;

import com.krontech.backend.entity.BlogPostTranslation;
import com.krontech.backend.entity.ContentStatus;
import com.krontech.backend.entity.ProductTranslation;
import com.krontech.backend.repository.BlogPostTranslationRepository;
import com.krontech.backend.repository.ProductTranslationRepository;
import com.krontech.backend.service.RevalidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledPublishJob {

    private final BlogPostTranslationRepository blogPostTranslationRepository;
    private final ProductTranslationRepository productTranslationRepository;
    private final RevalidationService revalidationService;

    /**
     * Her dakika çalışır.
     * SCHEDULED statüsündeki ve scheduledAt tarihi geçmiş içerikleri PUBLISHED yapar.
     */
    @Scheduled(fixedDelay = 60_000)
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blog-posts",         allEntries = true),
        @CacheEvict(value = "blog-posts-featured", allEntries = true),
        @CacheEvict(value = "blog-posts-tag",      allEntries = true),
        @CacheEvict(value = "blog-post-slug",      allEntries = true),
        @CacheEvict(value = "products",            allEntries = true),
        @CacheEvict(value = "product-slug",        allEntries = true),
    })
    public void publishScheduledContent() {
        LocalDateTime now = LocalDateTime.now();

        // --- Blog yazıları ---
        List<BlogPostTranslation> blogsDue = blogPostTranslationRepository
                .findByStatusAndScheduledAtBefore(ContentStatus.SCHEDULED, now);

        if (!blogsDue.isEmpty()) {
            for (BlogPostTranslation t : blogsDue) {
                t.setStatus(ContentStatus.PUBLISHED);
                t.setPublishedAt(now);
                t.setScheduledAt(null);
                blogPostTranslationRepository.save(t);

                String slug = t.getBlogPost().getSlug();
                log.info("[ScheduledPublish] Blog yayınlandı: slug={}, lang={}",
                         slug, t.getLanguage().getCode());
                revalidationService.revalidateBlog(slug);
            }
        }

        // --- Ürünler ---
        List<ProductTranslation> productsDue = productTranslationRepository
                .findByStatusAndScheduledAtBefore(ContentStatus.SCHEDULED, now);

        if (!productsDue.isEmpty()) {
            for (ProductTranslation t : productsDue) {
                t.setStatus(ContentStatus.PUBLISHED);
                t.setPublishedAt(now);
                t.setScheduledAt(null);
                productTranslationRepository.save(t);

                String slug = t.getProduct().getSlug();
                log.info("[ScheduledPublish] Ürün yayınlandı: slug={}, lang={}",
                         slug, t.getLanguage().getCode());
                revalidationService.revalidateProduct(slug);
            }
        }
    }
}