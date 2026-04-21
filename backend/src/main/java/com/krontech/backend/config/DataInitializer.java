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
    @Autowired private MediaRepository mediaRepository;
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
                {
                        "pam-kron", "PAM Kron", "Privileged Access Management", "Ayrıcalıklı erişim yönetimi çözümü",
                        "Protect your data and critical infrastructure with Kron PAM by managing privileged users and sessions.",
                        "Kritik altyapınızı ve verilerinizi yetkili kullanıcı ve oturumları yöneterek koruyun.",
                        "identity-access"
                },
                {
                        "password-vault", "Password Vault", "Password Vault", "Şifre Kasası",
                        "Prevent sharing of authorized account passwords and hijacking by malicious people with Password Vault.",
                        "Yetkili hesap şifrelerinin paylaşılmasını ve kötü niyetli kişiler tarafından ele geçirilmesini Password Vault ile önleyin.",
                        "identity-access"
                },
                {
                        "privileged-session-manager", "Privileged Session Manager", "Privileged Session Manager", "Ayrıcalıklı Oturum Yöneticisi",
                        "Session Manager logs and records all sessions for network and servers, including command and context-aware filtering.",
                        "Oturum Yöneticisi, ağ ve sunucular için komut ve bağlam farkında filtreleme dahil tüm oturumları kaydeder.",
                        "identity-access"
                },
                {
                        "multi-factor-authentication", "Multi-Factor Authentication", "Multi-Factor Authentication", "Çok Faktörlü Kimlik Doğrulama",
                        "Secure the remote access to your critical data with Multi-Factor Authentication's advanced features such as OTP, geolocation and time-based authentication.",
                        "OTP, coğrafi konum ve zaman tabanlı kimlik doğrulama gibi gelişmiş özelliklerle kritik verilerinize uzaktan erişimi güvence altına alın.",
                        "identity-access"
                },
                {
                        "endpoint-privileged-management", "Endpoint Privileged Management", "Endpoint Privileged Management", "Uç Nokta Ayrıcalık Yönetimi",
                        "Authorize applications and commands on endpoints with Endpoint Privilege Management, ensure the principle of least privilege effortlessly.",
                        "Uç Nokta Ayrıcalık Yönetimi ile uç noktalardaki uygulama ve komutları yetkilendirin, en az ayrıcalık ilkesini zahmetsizce uygulayın.",
                        "identity-access"
                },
                {
                        "user-behavior-analytics", "User Behavior Analytics", "User Behavior Analytics", "Kullanıcı Davranış Analizi",
                        "Detect malicious activities of internal threats with AI-powered advanced algorithms of User Behavior Analysis.",
                        "Kullanıcı Davranış Analizinin yapay zeka destekli gelişmiş algoritmalarıyla iç tehditlerin kötü niyetli aktivitelerini tespit edin.",
                        "identity-access"
                },
                {
                        "unified-access-manager", "Unified Access Manager", "Unified Access Manager", "Birleşik Erişim Yöneticisi",
                        "Unified Access Manager provides AAA services for network infrastructure and extends authentication and policy configurations of AD to network.",
                        "Birleşik Erişim Yöneticisi, ağ altyapısı için AAA hizmetleri sağlar ve AD'nin kimlik doğrulama ve politika yapılandırmalarını ağa genişletir.",
                        "identity-access"
                },
                {
                        "data-security", "Data Security", "Data Security & Management", "Veri güvenliği ve yönetim platformu",
                        "Secure your sensitive data with dynamic masking, activity monitoring and telemetry solutions.",
                        "Dinamik maskeleme, aktivite izleme ve telemetri çözümleriyle hassas verilerinizi koruyun.",
                        "data"
                },
                {
                        "network-security", "Network Security", "Network Security Solutions", "Ağ güvenliği çözümleri",
                        "Protect your network infrastructure with comprehensive network security and access control.",
                        "Kapsamlı ağ güvenliği ve erişim kontrolüyle altyapınızı koruyun.",
                        "network"
                },
                {
                        "dam", "Database Activity Monitoring", "Database Activity Monitoring", "Veritabanı Aktivite İzleme",
                        "Secure your databases with Kron DAM and ensure continuous compliance, data integrity, and operational stability.",
                        "Kron DAM ile veritabanlarınızı koruyun ve sürekli uyumluluk, veri bütünlüğü ve operasyonel istikrar sağlayın.",
                        "data"
                },
                {
                        "aaa-solution", "AAA Solution & Subscriber Management", "AAA Solution & Subscriber Management", "AAA Solution & Abone Yönetimi",
                        "Manage authentication, authorization and accounting operations of mobile & fixed access subscriptions by Kron AAA.",
                        "Mobil ve sabit ağ aboneliklerinin kimlik doğrulama, yetkilendirme ve hesap yönetimini Kron AAA ile yönetin.",
                        "network"
                },
        };

        for (Object[] p : products) {
            Product product = new Product();
            product.setSlug((String) p[0]);
            product.setCategory((String) p[6]);
            product.setActive(true);
            product.setSortOrder(0);
            product = productRepository.save(product);

            ProductTranslation ptTr = new ProductTranslation();
            ptTr.setProduct(product);
            ptTr.setLanguage(tr);
            ptTr.setTitle((String) p[2]);
            ptTr.setShortDescription((String) p[5]);
            ptTr.setStatus(ContentStatus.PUBLISHED);
            ptTr.setPublishedAt(LocalDateTime.now());
            productTranslationRepository.save(ptTr);

            ProductTranslation ptEn = new ProductTranslation();
            ptEn.setProduct(product);
            ptEn.setLanguage(en);
            ptEn.setTitle((String) p[2]);
            ptEn.setShortDescription((String) p[4]);
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
                        "zero-trust-mimarisi",
                        "https://krontech.com/_upload/blogimages/your-biggest-security-risk-isn-t-human-fixing-non-human-identities-with-kron-pam_blog.png",
                        "zero-trust-blog.png",
                        "Zero Trust Mimarisi Neden Önemlidir?",
                        "Zero Trust Security Architecture: Why It Matters",
                        "Sıfır güven mimarisi, modern siber güvenliğin temel taşlarından biri haline gelmiştir.",
                        "Zero trust architecture has become one of the cornerstones of modern cybersecurity.",
                        "<p>Zero trust mimarisi, hiçbir kullanıcıya veya cihaza otomatik olarak güvenilmemesi gerektiği ilkesine dayanır.</p>",
                        "<p>Zero trust architecture is based on the principle that no user or device should be automatically trusted.</p>"
                },
                {
                        "pam-nedir",
                        "https://krontech.com/_upload/blogimages/2026-cybersecurity-predictions-why-kron-pam-and-kron-dam-ddm-sit-at-the-center_blog.jpg",
                        "pam-blog.jpg",
                        "PAM Nedir? Ayrıcalıklı Erişim Yönetimine Giriş",
                        "What is PAM? An Introduction to Privileged Access Management",
                        "Ayrıcalıklı erişim yönetimi, kritik sistem ve verilere erişimi kontrol eder.",
                        "Privileged access management controls access to critical systems and data.",
                        "<p>PAM çözümleri, yetkili kullanıcıların sistem kaynaklarına erişimini merkezi olarak yönetir ve denetler.</p>",
                        "<p>PAM solutions centrally manage and audit privileged user access to system resources.</p>"
                },
                {
                        "veri-guvenligi",
                        "https://krontech.com/_upload/blogimages/multi-tenant-privileged-access-management-for-msps-and-mssps_blog.jpg",
                        "data-security-blog.jpg",
                        "Veri Güvenliği: En İyi Pratikler",
                        "Data Security: Best Practices",
                        "Kurumsal veri güvenliği stratejileri ve uygulamaları hakkında kapsamlı bir rehber.",
                        "A comprehensive guide on enterprise data security strategies and implementations.",
                        "<p>Veri güvenliği, hassas bilgilerin yetkisiz erişime, kullanıma veya ifşaya karşı korunması sürecidir.</p>",
                        "<p>Data security is the process of protecting sensitive information against unauthorized access, use, or disclosure.</p>"
                },
        };

        for (Object[] p : posts) {
            // Media oluştur
            Media media = new Media();
            media.setUrl((String) p[1]);
            media.setFilename((String) p[2]);
            media.setMimeType("image/jpeg");
            media.setAltText((String) p[3]);
            media.setUploadedBy(admin);
            media = mediaRepository.save(media);

            // BlogPost oluştur
            BlogPost post = new BlogPost();
            post.setSlug((String) p[0]);
            post.setAuthor(admin);
            post.setFeaturedImage(media);
            post = blogPostRepository.save(post);

            BlogPostTranslation bpTr = new BlogPostTranslation();
            bpTr.setBlogPost(post);
            bpTr.setLanguage(tr);
            bpTr.setTitle((String) p[3]);
            bpTr.setExcerpt((String) p[5]);
            bpTr.setContent((String) p[7]);
            bpTr.setStatus(ContentStatus.PUBLISHED);
            bpTr.setPublishedAt(LocalDateTime.now());
            blogPostTranslationRepository.save(bpTr);

            BlogPostTranslation bpEn = new BlogPostTranslation();
            bpEn.setBlogPost(post);
            bpEn.setLanguage(en);
            bpEn.setTitle((String) p[4]);
            bpEn.setExcerpt((String) p[6]);
            bpEn.setContent((String) p[8]);
            bpEn.setStatus(ContentStatus.PUBLISHED);
            bpEn.setPublishedAt(LocalDateTime.now());
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