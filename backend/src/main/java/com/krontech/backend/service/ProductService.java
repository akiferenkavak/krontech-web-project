package com.krontech.backend.service;

import com.krontech.backend.dto.request.ProductCreateRequest;
import com.krontech.backend.dto.request.ProductTranslationRequest;
import com.krontech.backend.dto.response.ProductDetailResponse;
import com.krontech.backend.dto.response.ProductSummaryResponse;
import com.krontech.backend.dto.response.ProductTranslationResponse;
import com.krontech.backend.entity.*;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductTranslationRepository translationRepository;
    private final LanguageRepository languageRepository;
    private final MediaRepository mediaRepository;

    // --- Tüm ürünleri liste olarak getir (hafif DTO) ---
    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getAllProducts(String langCode) {
        return productRepository.findAll()
                .stream()
                .map(p -> mapToSummary(p, langCode))
                .toList();
    }

    // --- Sadece üst seviye kategorileri getir ---
    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getRootProducts(String langCode) {
        return productRepository.findByParentIsNullAndIsActiveTrue()
                .stream()
                .map(p -> mapToSummary(p, langCode))
                .toList();
    }

    // --- Belirli bir kategorinin alt ürünleri ---
    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getChildProducts(UUID parentId, String langCode) {
        if (!productRepository.existsById(parentId)) {
            throw new ResourceNotFoundException("Ürün bulunamadı! ID: " + parentId);
        }
        return productRepository.findByParentIdAndIsActiveTrue(parentId)
                .stream()
                .map(p -> mapToSummary(p, langCode))
                .toList();
    }

    // --- ID ile detay getir ---
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(UUID id) {
        Product product = productRepository.findByIdWithTranslations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı! ID: " + id));
        return mapToDetail(product);
    }

    // --- Slug ile detay getir (frontend için asıl kullanılan endpoint) ---
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugWithTranslations(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı! Slug: " + slug));
        return mapToDetail(product);
    }

    // --- Yeni ürün oluştur ---
    @Transactional
    public ProductDetailResponse createProduct(ProductCreateRequest request) {
        if (productRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Bu slug zaten kullanımda: " + request.slug());
        }

        Product.ProductBuilder builder = Product.builder()
                .slug(request.slug())
                .category(request.category())
                .isActive(request.isActive())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0);

        if (request.parentId() != null) {
            Product parent = productRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent ürün bulunamadı! ID: " + request.parentId()));
            builder.parent(parent);
        }

        if (request.featuredImageId() != null) {
            Media image = mediaRepository.findById(request.featuredImageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medya bulunamadı! ID: " + request.featuredImageId()));
            builder.featuredImage(image);
        }

        Product saved = productRepository.save(builder.build());
        return mapToDetail(saved);
    }

    // --- Ürün güncelle ---
    @Transactional
    public ProductDetailResponse updateProduct(UUID id, ProductCreateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı! ID: " + id));

        if (!product.getSlug().equals(request.slug()) && productRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Bu slug zaten kullanımda: " + request.slug());
        }

        product.setSlug(request.slug());
        product.setCategory(request.category());
        product.setActive(request.isActive());
        product.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);

        if (request.parentId() != null) {
            Product parent = productRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent ürün bulunamadı! ID: " + request.parentId()));
            product.setParent(parent);
        } else {
            product.setParent(null);
        }

        if (request.featuredImageId() != null) {
            Media image = mediaRepository.findById(request.featuredImageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medya bulunamadı! ID: " + request.featuredImageId()));
            product.setFeaturedImage(image);
        }

        return mapToDetail(productRepository.save(product));
    }

    // --- Ürün sil ---
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı! ID: " + id));

        if (!product.getChildren().isEmpty()) {
            throw new IllegalStateException("Alt ürünleri olan bir ürün silinemez. Önce alt ürünleri silin veya taşıyın.");
        }

        productRepository.delete(product);
    }

    // --- Translation ekle veya güncelle (upsert) ---
    @Transactional
    public ProductDetailResponse upsertTranslation(UUID productId, ProductTranslationRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı! ID: " + productId));

        Language language = languageRepository.findById(request.languageId())
                .orElseThrow(() -> new ResourceNotFoundException("Dil bulunamadı! ID: " + request.languageId()));

        // Var olan translation'ı bul veya yeni oluştur
        ProductTranslation translation = translationRepository
                .findByProductIdAndLanguageCode(productId, language.getCode())
                .orElse(ProductTranslation.builder()
                        .product(product)
                        .language(language)
                        .build());

        translation.setTitle(request.title());
        translation.setShortDescription(request.shortDescription());
        translation.setContent(request.content());
        translation.setSeoTitle(request.seoTitle());
        translation.setSeoDescription(request.seoDescription());
        translation.setOgTitle(request.ogTitle());
        translation.setOgDescription(request.ogDescription());
        translation.setCanonicalUrl(request.canonicalUrl());
        translation.setIndexPage(request.indexPage());
        translation.setStructuredData(request.structuredData());
        translation.setScheduledAt(request.scheduledAt());
        translation.setHowItWorksContent(request.howItWorksContent());
        translation.setKeyBenefitsContent(request.keyBenefitsContent());
        translation.setProductFamilyContent(request.productFamilyContent());

        ContentStatus status = request.status() != null ? request.status() : ContentStatus.DRAFT;
        translation.setStatus(status);

        // PUBLISHED'a geçişte publishedAt otomatik set edilir
        if (status == ContentStatus.PUBLISHED && translation.getPublishedAt() == null) {
            translation.setPublishedAt(LocalDateTime.now());
        }

        translationRepository.save(translation);

        return mapToDetail(productRepository.findByIdWithTranslations(productId).orElseThrow());
    }

    // --- Translation sil ---
    @Transactional
    public void deleteTranslation(UUID productId, UUID translationId) {
        ProductTranslation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new ResourceNotFoundException("Translation bulunamadı! ID: " + translationId));

        if (!translation.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Bu translation belirtilen ürüne ait değil.");
        }

        translationRepository.delete(translation);
    }

    // --- MAPPER'LAR ---

    private ProductSummaryResponse mapToSummary(Product product, String langCode) {
        ProductTranslation translation = product.getTranslations().stream()
                .filter(t -> t.getLanguage().getCode().equals(langCode))
                .findFirst()
                .orElse(null);

        return new ProductSummaryResponse(
                product.getId(),
                product.getSlug(),
                product.getCategory(),
                product.isActive(),
                product.getSortOrder(),
                product.getParent() != null ? product.getParent().getId() : null,
                product.getFeaturedImage() != null ? product.getFeaturedImage().getUrl() : null,
                translation != null ? translation.getTitle() : null,
                translation != null ? translation.getShortDescription() : null
        );
    }

    private ProductDetailResponse mapToDetail(Product product) {
        List<ProductTranslationResponse> translations = product.getTranslations()
                .stream()
                .map(this::mapTranslation)
                .toList();

        List<ProductSummaryResponse> children = product.getChildren()
                .stream()
                .filter(Product::isActive)
                .map(c -> mapToSummary(c, "en")) // default lang
                .toList();

        return new ProductDetailResponse(
                product.getId(),
                product.getSlug(),
                product.getCategory(),
                product.isActive(),
                product.getSortOrder(),
                product.getParent() != null ? product.getParent().getId() : null,
                product.getBannerImageUrl(),
                product.getFeaturedImage() != null ? product.getFeaturedImage().getUrl() : null,
                translations,
                children,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private ProductTranslationResponse mapTranslation(ProductTranslation t) {
        return new ProductTranslationResponse(
                t.getId(),
                t.getLanguage().getCode(),
                t.getLanguage().getName(),
                t.getTitle(),
                t.getShortDescription(),
                t.getContent(),
                t.getSeoTitle(),
                t.getSeoDescription(),
                t.getOgTitle(),
                t.getOgDescription(),
                t.getCanonicalUrl(),
                t.isIndexPage(),
                t.getStructuredData(),
                t.getStatus(),
                t.getPublishedAt(),
                t.getScheduledAt(),
                t.getHowItWorksContent(),
                t.getKeyBenefitsContent(),
                t.getProductFamilyContent()
        );
    }
}
