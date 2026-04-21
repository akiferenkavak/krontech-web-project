package com.krontech.backend.service;

import com.krontech.backend.dto.request.BlogPostCreateRequest;
import com.krontech.backend.dto.request.BlogPostTranslationRequest;
import com.krontech.backend.dto.response.*;
import com.krontech.backend.entity.*;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final BlogPostTranslationRepository translationRepository;
    private final TagRepository tagRepository;
    private final LanguageRepository languageRepository;
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

    // --- Yayınlanmış yazıları sayfalanmış getir ---
    @Transactional(readOnly = true)
    public PagedResponse<BlogPostSummaryResponse> getPublishedPosts(
            String langCode, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> result = blogPostRepository.findPublishedByLanguage(
                langCode, ContentStatus.PUBLISHED, pageable);

        List<BlogPostSummaryResponse> content = result.getContent()
                .stream()
                .map(post -> mapToSummary(post, langCode))
                .toList();

        return new PagedResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    // --- Tag'e göre filtreli liste ---
    @Transactional(readOnly = true)
    public PagedResponse<BlogPostSummaryResponse> getPostsByTag(
            String tagSlug, String langCode, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> result = blogPostRepository.findByTagSlugAndLanguage(
                tagSlug, langCode, ContentStatus.PUBLISHED, pageable);

        List<BlogPostSummaryResponse> content = result.getContent()
                .stream()
                .map(post -> mapToSummary(post, langCode))
                .toList();

        return new PagedResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    // --- Slug ile detay getir ---
    @Transactional(readOnly = true)
    public BlogPostDetailResponse getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog yazısı bulunamadı! Slug: " + slug));
        return mapToDetail(post);
    }

    @Transactional(readOnly = true)
    public List<BlogPostSummaryResponse> getFeaturedPosts(String langCode) {
        return blogPostRepository.findFeaturedByLanguage(langCode)
                .stream()
                .map(post -> mapToSummary(post, langCode))
                .toList();
    }

    // --- ID ile detay getir ---
    @Transactional(readOnly = true)
    public BlogPostDetailResponse getPostById(UUID id) {
        BlogPost post = blogPostRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog yazısı bulunamadı! ID: " + id));
        return mapToDetail(post);
    }

    // --- Yeni post oluştur ---
    @Transactional
    public BlogPostDetailResponse createPost(BlogPostCreateRequest request) {
        if (blogPostRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Bu slug zaten kullanımda: " + request.slug());
        }

        BlogPost.BlogPostBuilder builder = BlogPost.builder()
                .slug(request.slug());

        if (request.authorId() != null) {
            User author = userRepository.findById(request.authorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı! ID: " + request.authorId()));
            builder.author(author);
        }

        if (request.featuredImageId() != null) {
            Media image = mediaRepository.findById(request.featuredImageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medya bulunamadı! ID: " + request.featuredImageId()));
            builder.featuredImage(image);
        }

        BlogPost post = builder.build();

        // Tag'leri slug listesinden çöz ve ata
        if (request.tagSlugs() != null && !request.tagSlugs().isEmpty()) {
            List<Tag> tags = resolveTags(request.tagSlugs());
            post.setTags(tags);
        }

        BlogPost saved = blogPostRepository.save(post);
        return mapToDetail(blogPostRepository.findByIdWithDetails(saved.getId()).orElseThrow());
    }

    // --- Post güncelle ---
    @Transactional
    public BlogPostDetailResponse updatePost(UUID id, BlogPostCreateRequest request) {
        BlogPost post = blogPostRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog yazısı bulunamadı! ID: " + id));

        if (!post.getSlug().equals(request.slug()) && blogPostRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Bu slug zaten kullanımda: " + request.slug());
        }

        post.setSlug(request.slug());

        if (request.authorId() != null) {
            User author = userRepository.findById(request.authorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı! ID: " + request.authorId()));
            post.setAuthor(author);
        }

        if (request.featuredImageId() != null) {
            Media image = mediaRepository.findById(request.featuredImageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medya bulunamadı! ID: " + request.featuredImageId()));
            post.setFeaturedImage(image);
        }

        if (request.tagSlugs() != null) {
            post.setTags(resolveTags(request.tagSlugs()));
        }

        blogPostRepository.save(post);
        return mapToDetail(blogPostRepository.findByIdWithDetails(id).orElseThrow());
    }

    // --- Post sil ---
    @Transactional
    public void deletePost(UUID id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog yazısı bulunamadı! ID: " + id));
        blogPostRepository.delete(post);
    }

    // --- Translation upsert ---
    @Transactional
    public BlogPostDetailResponse upsertTranslation(UUID postId, BlogPostTranslationRequest request) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog yazısı bulunamadı! ID: " + postId));

        Language language = languageRepository.findById(request.languageId())
                .orElseThrow(() -> new ResourceNotFoundException("Dil bulunamadı! ID: " + request.languageId()));

        BlogPostTranslation translation = translationRepository
                .findByBlogPostIdAndLanguageCode(postId, language.getCode())
                .orElse(BlogPostTranslation.builder()
                        .blogPost(post)
                        .language(language)
                        .build());

        translation.setTitle(request.title());
        translation.setExcerpt(request.excerpt());
        translation.setContent(request.content());
        translation.setSeoTitle(request.seoTitle());
        translation.setSeoDescription(request.seoDescription());
        translation.setStructuredData(request.structuredData());
        translation.setScheduledAt(request.scheduledAt());

        ContentStatus status = request.status() != null ? request.status() : ContentStatus.DRAFT;
        translation.setStatus(status);

        if (status == ContentStatus.PUBLISHED && translation.getPublishedAt() == null) {
            translation.setPublishedAt(LocalDateTime.now());
        }

        translationRepository.save(translation);
        return mapToDetail(blogPostRepository.findByIdWithDetails(postId).orElseThrow());
    }

    // --- Translation sil ---
    @Transactional
    public void deleteTranslation(UUID postId, UUID translationId) {
        BlogPostTranslation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new ResourceNotFoundException("Translation bulunamadı! ID: " + translationId));

        if (!translation.getBlogPost().getId().equals(postId)) {
            throw new IllegalArgumentException("Bu translation belirtilen blog yazısına ait değil.");
        }

        translationRepository.delete(translation);
    }

    // --- Tüm tag'leri getir ---
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAllWithTranslations()
                .stream()
                .map(this::mapTag)
                .toList();
    }

    // --- Tag oluştur ---
    @Transactional
    public TagResponse createTag(String slug) {
        if (tagRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Bu tag slug zaten kullanımda: " + slug);
        }
        Tag tag = Tag.builder().slug(slug).build();
        return mapTag(tagRepository.save(tag));
    }

    // --- YARDIMCI METOTLAR ---

    private List<Tag> resolveTags(List<String> slugs) {
        List<Tag> tags = new ArrayList<>();
        for (String slug : slugs) {
            Tag tag = tagRepository.findBySlug(slug)
                    .orElseThrow(() -> new ResourceNotFoundException("Tag bulunamadı! Slug: " + slug));
            tags.add(tag);
        }
        return tags;
    }

    // --- MAPPER'LAR ---

    private BlogPostSummaryResponse mapToSummary(BlogPost post, String langCode) {
        // İstenen dildeki translation'ı bul
        BlogPostTranslation translation = post.getTranslations().stream()
                .filter(t -> t.getLanguage().getCode().equals(langCode))
                .findFirst()
                .orElse(null);

        return new BlogPostSummaryResponse(
                post.getId(),
                post.getSlug(),
                translation != null ? translation.getTitle() : null,
                translation != null ? translation.getExcerpt() : null,
                post.getFeaturedImage() != null ? post.getFeaturedImage().getUrl() : null,
                post.getAuthor() != null ? post.getAuthor().getEmail() : null,
                post.getTags().stream().map(this::mapTag).toList(),
                translation != null ? translation.getPublishedAt() : null,
                post.isFeatured()
        );
    }

    private BlogPostDetailResponse mapToDetail(BlogPost post) {
        return new BlogPostDetailResponse(
                post.getId(),
                post.getSlug(),
                post.getFeaturedImage() != null ? post.getFeaturedImage().getUrl() : null,
                post.getAuthor() != null ? post.getAuthor().getEmail() : null,
                post.getTags().stream().map(this::mapTag).toList(),
                post.getTranslations().stream().map(this::mapTranslation).toList(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private BlogPostTranslationResponse mapTranslation(BlogPostTranslation t) {
        return new BlogPostTranslationResponse(
                t.getId(),
                t.getLanguage().getCode(),
                t.getLanguage().getName(),
                t.getTitle(),
                t.getExcerpt(),
                t.getContent(),
                t.getSeoTitle(),
                t.getSeoDescription(),
                t.getStructuredData(),
                t.getStatus(),
                t.getPublishedAt(),
                t.getScheduledAt()
        );
    }

    private TagResponse mapTag(Tag tag) {
        return new TagResponse(
                tag.getId(),
                tag.getSlug(),
                tag.getTranslations().stream()
                        .map(t -> new TagTranslationResponse(t.getLanguage().getCode(), t.getName()))
                        .toList()
        );
    }
}
