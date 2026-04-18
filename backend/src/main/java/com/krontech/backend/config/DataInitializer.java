package com.krontech.backend.config;

import com.krontech.backend.entity.*;
import com.krontech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired private ProductRepository productRepository;
    @Autowired private ProductTranslationRepository productTranslationRepository;
    @Autowired private LanguageRepository languageRepository;
    @Autowired private BlogPostRepository blogPostRepository;
    @Autowired private BlogPostTranslationRepository blogPostTranslationRepository;
    @Autowired private FormDefinitionRepository formDefinitionRepository;
    @Autowired private ResourceRepository resourceRepository;
    @Autowired private ResourceTranslationRepository resourceTranslationRepository;
    @Value("${app.admin.email:admin@krontech.com}")
    private String adminEmail;

    @Value("${app.admin.password:changeme}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedProducts();
        seedBlogPosts();
        seedForms();
        seedResources();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(adminEmail)) return;

        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(UserRole.ADMIN)
                .build();

        userRepository.save(admin);
        log.info("Default admin user created: {}", adminEmail);
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        Language tr = languageRepository.findByCode("tr").orElseGet(() -> {
            Language l = new Language();
            l.setCode("tr");
            l.setName("Türkçe");
            l.setDefault(true);
            return languageRepository.save(l);
        });

        Language en = languageRepository.findByCode("en").orElseGet(() -> {
            Language l = new Language();
            l.setCode("en");
            l.setName("English");
            l.setDefault(false);
            return languageRepository.save(l);
        });

        Object[][] products = {
            {"pam-kron",         "identity-access", "PAM Kron",         "Privileged Access Management",  "Ayrıcalıklı erişim yönetimi"},
            {"data-security",    "data",            "Data Security",    "Data Security & Management",    "Veri güvenliği ve yönetimi"},
            {"network-security", "network",         "Network Security", "Network Security Solutions",    "Ağ güvenliği çözümleri"},
        };

        for (Object[] p : products) {
            Product product = new Product();
            product.setSlug((String) p[0]);
            product.setCategory((String) p[1]);
            product.setActive(true);
            product.setSortOrder(0);
            product = productRepository.save(product);

            ProductTranslation ptTr = new ProductTranslation();
            ptTr.setProduct(product);
            ptTr.setLanguage(tr);
            ptTr.setTitle((String) p[2]);
            ptTr.setShortDescription((String) p[4]);
            ptTr.setStatus(ContentStatus.PUBLISHED);
            ptTr.setPublishedAt(LocalDateTime.now());
            productTranslationRepository.save(ptTr);

            ProductTranslation ptEn = new ProductTranslation();
            ptEn.setProduct(product);
            ptEn.setLanguage(en);
            ptEn.setTitle((String) p[2]);
            ptEn.setShortDescription((String) p[3]);
            ptEn.setStatus(ContentStatus.PUBLISHED);
            ptEn.setPublishedAt(LocalDateTime.now());
            productTranslationRepository.save(ptEn);
        }

        log.info("Seed products created.");
    }

    private void seedBlogPosts() {
        if (blogPostRepository.count() > 0) return;

        Language tr = languageRepository.findByCode("tr").orElseThrow();
        Language en = languageRepository.findByCode("en").orElseThrow();

        User admin = userRepository.findByEmail(adminEmail).orElseThrow();

        Object[][] posts = {
                {
                        "pam-nedir",
                        "PAM Nedir? Ayrıcalıklı Erişim Yönetimine Giriş",
                        "What is PAM? An Introduction to Privileged Access Management",
                        "Ayrıcalıklı erişim yönetimi (PAM), kritik sistem ve verilere erişimi kontrol eden güvenlik çözümleridir.",
                        "Privileged Access Management (PAM) refers to security solutions that control access to critical systems and data.",
                        "<p>Ayrıcalıklı erişim yönetimi, kurumların en hassas kaynaklarını korumak için kullandığı temel güvenlik katmanıdır.</p>",
                        "<p>Privileged Access Management is the fundamental security layer organizations use to protect their most sensitive resources.</p>",
                },
                {
                        "sifre-guvenligi",
                        "Şifre Güvenliği: En İyi Pratikler",
                        "Password Security: Best Practices",
                        "Güçlü şifre politikaları ve çok faktörlü kimlik doğrulama ile hesaplarınızı koruyun.",
                        "Protect your accounts with strong password policies and multi-factor authentication.",
                        "<p>Şifre güvenliği, siber güvenliğin temel taşlarından biridir. Güçlü şifreler ve MFA kullanımı kritik önem taşır.</p>",
                        "<p>Password security is one of the cornerstones of cybersecurity. Strong passwords and MFA usage are critically important.</p>",
                },
                {
                        "zero-trust-mimarisi",
                        "Zero Trust Mimarisi Neden Önemli?",
                        "Why Zero Trust Architecture Matters",
                        "Geleneksel güvenlik modellerinin yetersiz kaldığı günümüzde Zero Trust yaklaşımı öne çıkıyor.",
                        "As traditional security models fall short, the Zero Trust approach is coming to the forefront.",
                        "<p>Zero Trust mimarisi, hiçbir kullanıcıya veya sisteme varsayılan olarak güvenilmemesi ilkesine dayanır.</p>",
                        "<p>Zero Trust architecture is based on the principle of never trusting any user or system by default.</p>",
                },
        };

        for (Object[] p : posts) {
            BlogPost post = new BlogPost();
            post.setSlug((String) p[0]);
            post.setAuthor(admin);
            post = blogPostRepository.save(post);

            BlogPostTranslation bpTr = new BlogPostTranslation();
            bpTr.setBlogPost(post);
            bpTr.setLanguage(tr);
            bpTr.setTitle((String) p[1]);
            bpTr.setExcerpt((String) p[3]);
            bpTr.setContent((String) p[5]);
            bpTr.setStatus(ContentStatus.PUBLISHED);
            bpTr.setPublishedAt(java.time.LocalDateTime.now());
            blogPostTranslationRepository.save(bpTr);

            BlogPostTranslation bpEn = new BlogPostTranslation();
            bpEn.setBlogPost(post);
            bpEn.setLanguage(en);
            bpEn.setTitle((String) p[2]);
            bpEn.setExcerpt((String) p[4]);
            bpEn.setContent((String) p[6]);
            bpEn.setStatus(ContentStatus.PUBLISHED);
            bpEn.setPublishedAt(java.time.LocalDateTime.now());
            blogPostTranslationRepository.save(bpEn);
        }

        log.info("Seed blog posts created.");
    }
    private void seedForms() {
        if (formDefinitionRepository.existsBySlug("demo-request")) {
            return;
        }

        List<Map<String, Object>> fields = List.of(
                Map.of("name", "firstName",        "type", "text",     "required", true,
                        "label_tr", "Ad",                  "label_en", "First Name"),
                Map.of("name", "lastName",         "type", "text",     "required", true,
                        "label_tr", "Soyad",               "label_en", "Last Name"),
                Map.of("name", "email",            "type", "email",    "required", true,
                        "label_tr", "E-posta",             "label_en", "Email"),
                Map.of("name", "phone",            "type", "tel",      "required", false,
                        "label_tr", "Telefon",             "label_en", "Phone"),
                Map.of("name", "company",          "type", "text",     "required", true,
                        "label_tr", "Şirket",              "label_en", "Company"),
                Map.of("name", "interestedProduct","type", "select",   "required", false,
                        "label_tr", "İlgilenilen Ürün",    "label_en", "Product of Interest",
                        "source",   "api",
                        "endpoint", "/api/v1/products"),
                Map.of("name", "message",          "type", "textarea", "required", false,
                        "label_tr", "Mesaj",               "label_en", "Message")
        );

        FormDefinition demoForm = FormDefinition.builder()
                .name("Demo Request")
                .slug("demo-request")
                .fieldsSchema(fields)
                .isActive(true)
                .build();

        formDefinitionRepository.save(demoForm);
        log.info("Demo request form created.");
    }

    private void seedResources() {
    if (resourceRepository.count() > 0) return;

    Language tr = languageRepository.findByCode("tr").orElseThrow();
    Language en = languageRepository.findByCode("en").orElseThrow();

    Object[][] resources = {
        {
            "kron-pam-datasheet", "datasheet",
            "Kron PAM Datasheet", "Kron PAM Datasheet",
            "Kron PAM ürününün teknik özelliklerini ve özellik listesini içeren datasheet.",
            "Technical specifications and feature list for Kron PAM.",
            "pam-kron"
        },
        {
            "zero-trust-whitepaper", "whitepaper",
            "Zero Trust Güvenlik Mimarisi", "Zero Trust Security Architecture",
            "Kurumsal ağlarda Zero Trust mimarisinin nasıl uygulanacağını anlatan teknik rehber.",
            "A technical guide on implementing Zero Trust architecture in enterprise networks.",
            null
        },
        {
            "pam-case-study", "case-study",
            "Telekom Sektöründe PAM Uygulaması", "PAM Implementation in Telecom",
            "Büyük bir telekom operatörünün PAM çözümüyle insider threat'leri nasıl engellediği.",
            "How a major telecom operator prevented insider threats with PAM solution.",
            "pam-kron"
        },
    };

    for (Object[] r : resources) {
        Resource resource = new Resource();
        resource.setSlug((String) r[0]);
        resource.setType((String) r[1]);
        resource.setActive(true);
        resource = resourceRepository.save(resource);

        ResourceTranslation rtTr = new ResourceTranslation();
        rtTr.setResource(resource);
        rtTr.setLanguage(tr);
        rtTr.setTitle((String) r[2]);
        rtTr.setDescription((String) r[4]);
        rtTr.setStatus(ContentStatus.PUBLISHED);
        rtTr.setPublishedAt(LocalDateTime.now());
        resourceTranslationRepository.save(rtTr);

        ResourceTranslation rtEn = new ResourceTranslation();
        rtEn.setResource(resource);
        rtEn.setLanguage(en);
        rtEn.setTitle((String) r[3]);
        rtEn.setDescription((String) r[5]);
        rtEn.setStatus(ContentStatus.PUBLISHED);
        rtEn.setPublishedAt(LocalDateTime.now());
        resourceTranslationRepository.save(rtEn);
    }

    log.info("Seed resources created.");
}
}