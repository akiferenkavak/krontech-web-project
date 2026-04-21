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
    {
        "your-biggest-security-risk-isn-t-human",
        "https://krontech.com/_upload/blogimages/your-biggest-security-risk-isn-t-human-fixing-non-human-identities-with-kron-pam_blog.png",
        "non-human-identities-blog.png",
        "En Büyük Güvenlik Riskiniz İnsan Değil: Kron PAM ile İnsan Dışı Kimlikler",
        "Your Biggest Security Risk Isn't Human: Fixing Non-Human Identities with Kron PAM",
        "Bulut, DevOps ve otomasyon altyapısında insan dışı kimlikler kritik bir güvenlik riski haline gelmiştir.",
        "With the increasing size of organizations in cloud, DevOps, and automation-driven infrastructure, a new category of identities has risen to power in the background.",
        "<p>Servis hesapları, uygulamalar, API'ler ve botlar gibi insan dışı kimlikler, kritik altyapıya erişim için önemli ayrıcalıklara sahiptir.</p>",
        "<p>Non-human identities such as service accounts, applications, APIs, and bots possess significant privileges for accessing critical infrastructure.</p>"
    },
    {
        "veri-ihlalini-tespit-etme",
        "https://krontech.com/_upload/blogimages/7-basic-steps-to-identify-a-data-breach-blog-730x411_3.jpg",
        "data-breach-blog.jpg",
        "Veri İhlalini 7 Adımda Tespit Etme (Kontrol Listesi Dahil)",
        "How to Identify a Data Breach in 7 Steps (Checklist Included)",
        "Veri ihlalleri her zaman kendini belli etmez. Hasarı sınırlamak için hızlı tespit şarttır.",
        "Data breaches don't always make it clear when they happen. Quick detection is essential to limit damage.",
        "<p>Güvenlik ekibinizin takip edebileceği pratik, operasyon odaklı bir çerçeve sunuyoruz.</p>",
        "<p>We present a practical, operations-focused framework your security team can follow to identify breaches quickly.</p>"
    },
    {
        "mssp-icin-cok-kiracili-pam",
        "https://krontech.com/_upload/blogimages/multi-tenant-privileged-access-management-for-msps-and-mssps_blog.jpg",
        "multi-tenant-pam-blog.jpg",
        "MSP ve MSSP'ler için Çok Kiracılı Ayrıcalıklı Erişim Yönetimi",
        "Multi-Tenant Privileged Access Management for MSPs and MSSPs",
        "MSP ve MSSP'ler için ayrıcalıklı erişim yönetimi artık bir düzenleyici gereklilik haline gelmiştir.",
        "For MSPs and MSSPs, privileged access management is no longer just an internal security control - it is a regulatory requirement.",
        "<p>NIS2, DORA ve SOC 2 gibi çerçeveler, hizmet sağlayıcıları hem kendi hem de müşteri ortamlarındaki erişim kontrollerinden sorumlu tutmaktadır.</p>",
        "<p>Frameworks such as NIS2, DORA, and SOC 2 hold service providers accountable for access controls across every customer environment they touch.</p>"
    },
    {
        "kirik-dunyada-siber-guvensizlik",
        "https://krontech.com/_upload/blogimages/cyber-insecurity-in-a-fractured-world-why-privileged-access-has-become-a-strategic-risk_blog.jpg",
        "cyber-insecurity-blog.jpg",
        "Kırık Dünyada Siber Güvensizlik: Ayrıcalıklı Erişim Neden Stratejik Risk Haline Geldi?",
        "Cyber Insecurity in a Fractured World: Why Privileged Access Has Become a Strategic Risk",
        "Siber güvensizlik neden küresel bir risk haline geldi? Jeopolitik ve teknoloji kesişimi.",
        "Why has cyber insecurity become a top global risk? Learn how geopolitics and emerging technologies intersect.",
        "<p>Dünya Ekonomik Forumu'nun Küresel Riskler raporu, siber güvensizliği jeopolitik gerginliklerle bağlantılı olarak ele almaktadır.</p>",
        "<p>The World Economic Forum's Global Risks report addresses cyber insecurity in connection with geopolitical tensions.</p>"
    },
    {
        "kron-aaa-cok-nitelikli-guvenlik",
        "https://krontech.com/_upload/blogimages/securing-the-next-frontier-multi-attribute-security-with-kron-aaa_730x411_blog.jpg",
        "kron-aaa-blog.jpg",
        "Yeni Sınırı Güvence Altına Almak: Kron AAA ile Çok Nitelikli Güvenlik",
        "Securing the Next Frontier: Multi Attribute Security with Kron AAA",
        "Kron AAA ile çok nitelikli güvenlik yaklaşımı ağ erişim kontrolünü yeniden tanımlıyor.",
        "Kron AAA redefines network access control with a multi-attribute security approach.",
        "<p>Kron AAA çözümü, kimlik doğrulama, yetkilendirme ve hesap verebilirlik süreçlerini tek bir platformda birleştirir.</p>",
        "<p>Kron AAA solution unifies authentication, authorization, and accountability processes in a single platform.</p>"
    },
    {
        "2026-siber-guvenlik-tahminleri",
        "https://krontech.com/_upload/blogimages/2026-cybersecurity-predictions-why-kron-pam-and-kron-dam-ddm-sit-at-the-center_blog.jpg",
        "2026-predictions-blog.jpg",
        "2026 Siber Güvenlik Tahminleri: Kron PAM ve Kron DAM/DDM Neden Merkezdedir?",
        "2026 Cybersecurity Predictions: Why Kron PAM and Kron DAM / DDM Sit at the Center",
        "2026 yılında siber güvenlik dünyasını şekillendirecek trendler ve Kron'un bu trendlerdeki rolü.",
        "Trends that will shape the cybersecurity world in 2026 and Kron's role in these trends.",
        "<p>Yapay zeka destekli saldırılar, tedarik zinciri riskleri ve kimlik güvenliği 2026'nın en kritik konuları arasında yer alıyor.</p>",
        "<p>AI-powered attacks, supply chain risks, and identity security are among the most critical topics of 2026.</p>"
    },
    {
        "guvenlik-duvarı-loglarini-ipdr-e-donusturme",
        "https://krontech.com/_upload/blogimages/turning-firewall-logs-into-ipdr-with-kron-telemetry-pipeline.jpg",
        "firewall-ipdr-blog.jpg",
        "Kron Telemetri Pipeline ile Güvenlik Duvarı Loglarını IPDR'a Dönüştürme",
        "Turning Firewall Logs into IPDR with Kron Telemetry Pipeline",
        "Kron Telemetri Pipeline, güvenlik duvarı loglarını sıfır kayıpla IPDR formatına dönüştürür.",
        "Kron Telemetry Pipeline converts firewall logs to IPDR format with zero loss.",
        "<p>Telekom operatörleri için yasal uyumluluk gereksinimlerini karşılamak artık daha kolay.</p>",
        "<p>Meeting legal compliance requirements for telecom operators is now easier than ever.</p>"
    },
    {
        "oracle-rac-kron-dam-ddm",
        "https://krontech.com/_upload/blogimages/oracle-rac-simplified-how-kron-damddm-secures-multi-node-databases.png",
        "oracle-rac-blog.png",
        "Oracle RAC Basitleştirildi: Kron DAM&DDM Çok Düğümlü Veritabanlarını Nasıl Korur?",
        "Oracle RAC, Simplified: How Kron DAM&DDM Secures Multi-Node Databases",
        "Kron DAM ve DDM çözümleri Oracle RAC ortamlarında kapsamlı veritabanı güvenliği sağlar.",
        "Kron DAM and DDM solutions provide comprehensive database security in Oracle RAC environments.",
        "<p>Oracle RAC'ın karmaşık çok düğümlü yapısı, geleneksel güvenlik araçları için ciddi zorluklar yaratmaktadır.</p>",
        "<p>Oracle RAC's complex multi-node architecture creates serious challenges for traditional security tools.</p>"
    },
    {
        "kubernetes-telemetri",
        "https://krontech.com/_upload/blogimages/unifying-kubernetes-telemetry-in-a-diverse-and-fragmented-collector-world_blog.png",
        "kubernetes-telemetry-blog.png",
        "Çeşitli ve Parçalı Toplayıcı Dünyasında Kubernetes Telemetrisini Birleştirme",
        "Unifying Kubernetes Telemetry in a Diverse and Fragmented Collector World",
        "Kubernetes ortamlarında dağınık telemetri verilerini merkezi olarak yönetmenin yolları.",
        "Ways to centrally manage scattered telemetry data in Kubernetes environments.",
        "<p>Modern Kubernetes altyapılarında farklı toplayıcılar arasındaki uyumsuzluk operasyonel karmaşıklığı artırmaktadır.</p>",
        "<p>Incompatibility between different collectors in modern Kubernetes infrastructures increases operational complexity.</p>"
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
            post.setFeatured(true);
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