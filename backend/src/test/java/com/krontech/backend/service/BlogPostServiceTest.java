package com.krontech.backend.service;

import com.krontech.backend.dto.request.BlogPostCreateRequest;
import com.krontech.backend.dto.response.BlogPostDetailResponse;
import com.krontech.backend.dto.response.BlogPostSummaryResponse;
import com.krontech.backend.dto.response.PagedResponse;
import com.krontech.backend.entity.BlogPost;
import com.krontech.backend.entity.BlogPostTranslation;
import com.krontech.backend.entity.ContentStatus;
import com.krontech.backend.entity.Language;
import com.krontech.backend.entity.User;
import com.krontech.backend.entity.UserRole;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.BlogPostRepository;
import com.krontech.backend.repository.BlogPostTranslationRepository;
import com.krontech.backend.repository.LanguageRepository;
import com.krontech.backend.repository.MediaRepository;
import com.krontech.backend.repository.TagRepository;
import com.krontech.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("BlogPostService Unit Tests")
class BlogPostServiceTest {

    @Mock
    private BlogPostRepository blogPostRepository;

    @Mock
    private BlogPostTranslationRepository translationRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private LanguageRepository languageRepository;

    @Mock
    private MediaRepository mediaRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RevalidationService revalidationService;

    @InjectMocks
    private BlogPostService blogPostService;

    private BlogPost samplePost;
    private Language englishLanguage;
    private BlogPostTranslation englishTranslation;
    private User adminUser;

    @BeforeEach
    void setUp() {
        englishLanguage = new Language();
        englishLanguage.setId(UUID.randomUUID());
        englishLanguage.setCode("en");
        englishLanguage.setName("English");

        adminUser = User.builder()
                .email("admin@krontech.com")
                .passwordHash("hashed")
                .role(UserRole.ADMIN)
                .build();

        samplePost = BlogPost.builder()
                .slug("zero-trust-mimarisi")
                .author(adminUser)
                .featured(true)
                .translations(new ArrayList<>())
                .tags(new ArrayList<>())
                .build();

        // Reflection ile id set et
        try {
            var idField = samplePost.getClass().getSuperclass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(samplePost, UUID.randomUUID());
        } catch (Exception ignored) {}

        englishTranslation = new BlogPostTranslation();
        englishTranslation.setId(UUID.randomUUID());
        englishTranslation.setBlogPost(samplePost);
        englishTranslation.setLanguage(englishLanguage);
        englishTranslation.setTitle("Zero Trust Architecture: Why It Matters");
        englishTranslation.setExcerpt("An excerpt about zero trust.");
        englishTranslation.setContent("<p>Content here.</p>");
        englishTranslation.setStatus(ContentStatus.PUBLISHED);
        englishTranslation.setPublishedAt(LocalDateTime.now());

        samplePost.getTranslations().add(englishTranslation);
    }

    @Test
    @DisplayName("getPublishedPosts - sayfalı yayınlanmış yazıları döner")
    void getPublishedPosts_returnsMappedPagedResponse() {
        Page<BlogPost> page = new PageImpl<>(List.of(samplePost));

        when(blogPostRepository.findPublishedByLanguage(
                eq("en"), eq(ContentStatus.PUBLISHED), any(Pageable.class)
        )).thenReturn(page);

        PagedResponse<BlogPostSummaryResponse> result =
                blogPostService.getPublishedPosts("en", 0, 10);

        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).slug()).isEqualTo("zero-trust-mimarisi");
        assertThat(result.page()).isEqualTo(0);
        assertThat(result.totalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("getPublishedPosts - boş sayfa döndüğünde boş liste gelir")
    void getPublishedPosts_withEmptyPage_returnsEmptyContent() {
        when(blogPostRepository.findPublishedByLanguage(
                eq("en"), eq(ContentStatus.PUBLISHED), any(Pageable.class)
        )).thenReturn(Page.empty());

        PagedResponse<BlogPostSummaryResponse> result =
                blogPostService.getPublishedPosts("en", 0, 10);

        assertThat(result.content()).isEmpty();
        assertThat(result.totalElements()).isEqualTo(0);
    }

    @Test
    @DisplayName("getPostBySlug - var olan slug ile detay döner")
    void getPostBySlug_whenExists_returnsDetailResponse() {
        when(blogPostRepository.findBySlugWithDetails("zero-trust-mimarisi"))
                .thenReturn(Optional.of(samplePost));

        BlogPostDetailResponse result =
                blogPostService.getPostBySlug("zero-trust-mimarisi");

        assertThat(result).isNotNull();
        assertThat(result.slug()).isEqualTo("zero-trust-mimarisi");
        assertThat(result.translations()).hasSize(1);
    }

    @Test
    @DisplayName("getPostBySlug - olmayan slug ResourceNotFoundException fırlatır")
    void getPostBySlug_whenNotFound_throwsResourceNotFoundException() {
        when(blogPostRepository.findBySlugWithDetails("nonexistent"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> blogPostService.getPostBySlug("nonexistent"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("nonexistent");
    }

    @Test
    @DisplayName("createPost - mevcut slug ile IllegalArgumentException fırlatır")
    void createPost_whenSlugExists_throwsIllegalArgumentException() {
        when(blogPostRepository.existsBySlug("zero-trust-mimarisi")).thenReturn(true);

        BlogPostCreateRequest request = new BlogPostCreateRequest(
                "zero-trust-mimarisi", null, null, List.of(), null
        );

        assertThatThrownBy(() -> blogPostService.createPost(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("zero-trust-mimarisi");

        verify(blogPostRepository, never()).save(any());
    }

    @Test
    @DisplayName("getFeaturedPosts - öne çıkan yazıları döner")
    void getFeaturedPosts_returnsFeaturedList() {
        when(blogPostRepository.findFeaturedByLanguage("en"))
                .thenReturn(List.of(samplePost));

        List<BlogPostSummaryResponse> results =
                blogPostService.getFeaturedPosts("en");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).featured()).isTrue();
        verify(blogPostRepository).findFeaturedByLanguage("en");
    }

    @Test
    @DisplayName("deletePost - olmayan id ResourceNotFoundException fırlatır")
    void deletePost_whenNotFound_throwsResourceNotFoundException() {
        UUID randomId = UUID.randomUUID();
        when(blogPostRepository.findById(randomId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> blogPostService.deletePost(randomId))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(blogPostRepository, never()).delete(any());
    }
}