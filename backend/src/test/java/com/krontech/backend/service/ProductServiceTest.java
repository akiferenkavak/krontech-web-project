package com.krontech.backend.service;

import com.krontech.backend.dto.request.ProductCreateRequest;
import com.krontech.backend.dto.response.ProductDetailResponse;
import com.krontech.backend.entity.Product;
import com.krontech.backend.exception.ResourceNotFoundException;
import com.krontech.backend.repository.LanguageRepository;
import com.krontech.backend.repository.ProductRepository;
import com.krontech.backend.repository.ProductTranslationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    ProductRepository productRepository;
    @Mock
    ProductTranslationRepository translationRepository;
    @Mock
    LanguageRepository languageRepository;
    @Mock RevalidationService revalidationService;
    @InjectMocks
    ProductService productService;

    @Test
    void getProductBySlug_whenExists_returnsDetail() {
        // Arrange
        Product product = new Product();
        product.setSlug("pam-kron");
        product.setCategory("identity-access");
        when(productRepository.findBySlugWithTranslations("pam-kron"))
            .thenReturn(Optional.of(product));

        // Act
        ProductDetailResponse result = productService.getProductBySlug("pam-kron");

        // Assert
        assertThat(result.slug()).isEqualTo("pam-kron");
    }

    @Test
    void getProductBySlug_whenNotFound_throwsResourceNotFoundException() {
        when(productRepository.findBySlugWithTranslations("nonexistent"))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductBySlug("nonexistent"))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createProduct_whenSlugExists_throwsIllegalArgumentException() {
        when(productRepository.existsBySlug("existing-slug")).thenReturn(true);

        ProductCreateRequest request = new ProductCreateRequest(
            "existing-slug", "identity-access", true, 0, null, null, null
        );

        assertThatThrownBy(() -> productService.createProduct(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("slug");
    }
}
