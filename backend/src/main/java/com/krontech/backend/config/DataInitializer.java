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
                        "identity-access",
                        // p[7] — howItWorksContentEn
                        "<div><div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>How Kron PAM™ <span style='background:#2563eb;color:white;padding:0 4px'>Works?</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>This proven solution reduces the implementation time required to set up privileged access control by approximately 80% compared to other solutions and can scale to support tens of thousands of users and accounts, millions of devices and endpoints, and billions of authentication combinations. Kron PAM has a modular and integrated architecture to support a wide range of protocols and features on one platform.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/e3b73db8dd829b200cb9609d6cbbd8ef-5f117b5d40188.jpg' alt='How Kron PAM Works' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='background:white;margin-bottom:24px;overflow:hidden;padding:24px'><img src='https://krontech.com/_upload/images/single-connect-topology_1.png' alt='Kron PAM Topology' style='max-width:100%;height:auto;display:block;margin:0 auto'></div><div style='background:white;padding:32px 40px;margin-bottom:24px'><h3 style='font-size:18px;font-weight:700;color:#111827;margin:0 0 16px'>Reduce Complexity with <span style='background:#2563eb;color:white;padding:0 4px'>Kron PAM</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0 0 12px'>Whether applied to real time communications systems, desktops, mobile devices and collaboration applications, or to connected machines as part of Internet of Things deployments, Kron PAM dramatically reduces the complexity associated with a fully effective, fully compliant solution.</p><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0 0 12px'>Users log on to Kron PAM from a web-based interface to use services such as web-based remote desktop connections to a windows server, web based CLI connections to a network device, password checkout from a secure vault, etc.</p><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0 0 12px'>Users may prefer to connect using their regular native clients instead of the web-based interface. For example, users can use their own CLI client applications (e.g. Putty, SecureCRT, etc.) or Windows native remote desktop application or SQL client (TOAD, DataGrid, Navicat, etc.) applications to connect directly to Kron PAM proxy services.</p><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM admins connect via a web-based interface for administration and configuration purposes, such as changing user privileges, creating new policies, adding/removing endpoints.</p></div></div>",
                        // p[8] — keyBenefitsContentEn
                        "<div><div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Privileged <span style='background:#2563eb;color:white;padding:0 4px'>Access Management Platform</span> : Kron PAM</h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM is a comprehensive Privileged Access Management (PAM) software suite designed to prevent internal and external attacks aiming to compromise privileged accounts. Kron PAM is fast to deploy with its modular and agentless architecture. Kron PAM detects, prevents, and records malicious activities in real-time before they occur thanks to its advanced session management properties.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/6bf2789843157925e979e9379f71ce4c-5f0c5f465d6cf.jpg' alt='PAM Platform' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Unified <span style='background:#2563eb;color:white;padding:0 4px'>PAM Solution</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>The Kron PAM product family strengthens, simplifies and secures the management of privileged accounts, for enterprises and the network operators who serve them. Kron PAM unifies multivendor environments with pre-integrated modules, managing dozens of vendors and hundreds of network elements and servers with a single, universal system.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Central <span style='background:#2563eb;color:white;padding:0 4px'>Password Management</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>The Kron PAM Password Vault is a central secure password vault and helps you to prevent stealing or unauthorized sharing of passwords. Users check out the credentials of a privileged account from the Kron PAM Password Vault and then use the password to connect to target endpoints in order to fulfil their tasks.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'><span style='background:#2563eb;color:white;padding:0 4px'>Second Layer</span> of Security</h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>The Kron MFA Manager delivers an additional code (one-time-password) to users mobile phones that is required during authentication, which ensures users are who they say they are.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Unified <span style='background:#2563eb;color:white;padding:0 4px'>Access Management</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>Every authentication and command execution attempt of a user is forwarded from the device/server to the Kron PAM Unified Access Manager, enabling many features including single-sign-on, custom/least policy enforcement, indisputably logging, and multi-tenancy, to be centrally managed and delivered.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'><span style='background:#2563eb;color:white;padding:0 4px'>Database Access</span> Management</h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>The Kron PAM Database Access Manager controls, monitors and audits encrypted database administrator sessions. It supports Oracle, MsSQL, MySQL, Cassandra, Teradata and Hive. Kron PAM Database Access Manager also provides a dynamic data masking feature to prevent access to sensitive data.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Privileged <span style='background:#2563eb;color:white;padding:0 4px'>Session Control</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>The Kron PAM Privileged Session Manager has the capability to control, monitor and audit encrypted administrator sessions. The Man-in-the-middle approach requires no software agents to be deployed on target end points.</p></div></div>",
                        // p[9] — howItWorksContentTr
                        "<div><div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Kron PAM™ <span style='background:#2563eb;color:white;padding:0 4px'>Nasıl Çalışır?</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Bu kanıtlanmış çözüm, ayrıcalıklı erişim kontrolünü kurmak için gereken uygulama süresini diğer çözümlere kıyasla yaklaşık %80 oranında azaltır. On binlerce kullanıcı ve hesabı, milyonlarca cihaz ve uç noktayı destekleyecek şekilde ölçeklenebilir. Kron PAM, tek bir platformda geniş protokol ve özellik yelpazesini desteklemek için modüler ve entegre bir mimariye sahiptir.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/e3b73db8dd829b200cb9609d6cbbd8ef-5f117b5d40188.jpg' alt='How Kron PAM Works' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='background:white;margin-bottom:24px;overflow:hidden;padding:24px'><img src='https://krontech.com/_upload/images/single-connect-topology_1.png' alt='Kron PAM Topoloji' style='max-width:100%;height:auto;display:block;margin:0 auto'></div><div style='background:white;padding:32px 40px;margin-bottom:24px'><h3 style='font-size:18px;font-weight:700;color:#111827;margin:0 0 16px'><span style='background:#2563eb;color:white;padding:0 4px'>Kron PAM</span> ile Karmaşıklığı Azaltın</h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0 0 12px'>Gerçek zamanlı iletişim sistemlerine, masaüstü bilgisayarlara, mobil cihazlara veya IoT dağıtımlarının bir parçası olarak bağlı makinelere uygulandığında, Kron PAM tam anlamıyla etkili ve uyumlu bir çözümle ilişkili karmaşıklığı önemli ölçüde azaltır.</p><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM yöneticileri, kullanıcı ayrıcalıklarını değiştirme, yeni politikalar oluşturma ve uç noktaları ekleme/kaldırma gibi yönetim ve yapılandırma amaçlarıyla web tabanlı bir arayüz üzerinden bağlanır.</p></div></div>",
                        // p[10] — keyBenefitsContentTr
                        "<div><div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Ayrıcalıklı <span style='background:#2563eb;color:white;padding:0 4px'>Erişim Yönetimi Platformu</span> : Kron PAM</h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM, ayrıcalıklı hesapları ele geçirmeye yönelik iç ve dış saldırıları önlemek için tasarlanmış kapsamlı bir PAM yazılım paketidir. Modüler ve ajanssız mimarisiyle hızlı dağıtım sağlar. Gelişmiş oturum yönetimi özellikleri sayesinde kötü niyetli faaliyetleri gerçek zamanlı olarak tespit eder, önler ve kaydeder.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/6bf2789843157925e979e9379f71ce4c-5f0c5f465d6cf.jpg' alt='PAM Platformu' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Birleşik <span style='background:#2563eb;color:white;padding:0 4px'>PAM Çözümü</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>Kron PAM ürün ailesi, işletmeler ve onlara hizmet veren ağ operatörleri için ayrıcalıklı hesapların yönetimini güçlendirir, basitleştirir ve güvence altına alır.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Merkezi <span style='background:#2563eb;color:white;padding:0 4px'>Şifre Yönetimi</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>Kron PAM Şifre Kasası, şifrelerin çalınmasını veya yetkisiz paylaşımını önlemenize yardımcı olan merkezi bir güvenli şifre kasasıdır.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'><span style='background:#2563eb;color:white;padding:0 4px'>İkinci Katman</span> Güvenlik</h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>Kron MFA Yöneticisi, kimlik doğrulama sırasında gerekli olan ek bir kodu (tek kullanımlık şifre) kullanıcıların cep telefonlarına iletir.</p></div><div style='background:white;padding:24px 32px;margin-bottom:12px'><h5 style='font-size:16px;font-weight:700;color:#111827;margin:0 0 8px'>Ayrıcalıklı <span style='background:#2563eb;color:white;padding:0 4px'>Oturum Kontrolü</span></h5><p style='font-size:14px;color:#6b7280;line-height:1.6;margin:0'>Kron PAM Ayrıcalıklı Oturum Yöneticisi, şifreli yönetici oturumlarını kontrol etme, izleme ve denetleme kapasitesine sahiptir.</p></div></div>",
                        // p[11] — productFamilyContentEn
                        "<div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Unified <span style='background:#2563eb;color:white;padding:0 4px'>Access Management</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>The Kron PAM product family strengthens, simplifies and secures the management of privileged accounts, for enterprises and network operators. Kron PAM unifies multivendor environments with pre-integrated modules managing dozens of vendors and hundreds of network elements and servers with a single, universal system.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/37666f14b75a976dc438845820d9b727-5f0ba66747010.jpg' alt='Unified Access Management' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div>",
                        // p[12] — productFamilyContentTr
                        "<div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Birleşik <span style='background:#2563eb;color:white;padding:0 4px'>Erişim Yönetimi</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM ürün ailesi, işletmeler ve ağ operatörleri için ayrıcalıklı hesapların yönetimini güçlendirir, basitleştirir ve güvence altına alır. Kron PAM, önceden entegre modülleriyle çok satıcılı ortamları birleştirir ve tek bir evrensel sistemle düzinelerce satıcıyı ve yüzlerce ağ öğesini ve sunucuyu yönetir.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/37666f14b75a976dc438845820d9b727-5f0ba66747010.jpg' alt='Birleşik Erişim Yönetimi' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div>"
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
            product.setBannerImageUrl("https://krontech.com/_upload/bannerimages/7686dbf5cbd52b04682ab9420e26ca9a-5f0866e1014a4.jpg");
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
            ptEn.setContent("<div><div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Protect What You <span style='background:#2563eb;color:white;padding:0 4px'>Connect™</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>The Kron PAM™ Privileged Access Management Suite is known as the fastest to deploy and the most secure PAM solution in the marketplace, delivering IT operational security and efficiency to Enterprises and Telcos globally.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/6b23a469ed2ef99a40185918c987e614-5f08681d85fdd.jpg' alt='Protect What You Connect' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='display:flex;flex-direction:row-reverse;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Unified Management of <span style='background:#2563eb;color:white;padding:0 4px'>Privileged Access Control</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM enables IT managers and network admins to efficiently secure the access, control configurations and indisputably record all activities in the data center or network infrastructure, in which any breach in privileged accounts access might have material impact on business continuity.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/01578620c7801e4792e867d3cb325b80-5f1182c2b4149_1.jpg' alt='Privileged Access Control' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='display:flex;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Regulatory <span style='background:#2563eb;color:white;padding:0 4px'>Compliance</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Kron PAM provides tools, capabilities, indisputable log records and audit trails to help organizations comply with regulations including ISO 27001, ISO 31000:2009, KVKK, PCI DSS, EPDK, SOX, HIPAA, GDPR in highly regulated industries like finance, energy, health, and telecommunications.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/single-connect-pam-compliance-2_1.jpg' alt='Regulatory Compliance' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div><div style='display:flex;flex-direction:row-reverse;align-items:stretch;background:white;margin-bottom:24px;overflow:hidden'><div style='flex:1;padding:48px 56px;display:flex;flex-direction:column;justify-content:center'><h3 style='font-size:22px;font-weight:700;color:#111827;margin:0 0 16px'>Stronger, Simpler and <span style='background:#2563eb;color:white;padding:0 4px'>More Secure</span></h3><p style='font-size:15px;color:#4b5563;line-height:1.7;margin:0'>Cloud-native and designed to support Software Defined Networks today and in the future, Kron PAM prevents and detects breaches, maintains individual accountability, and increases operational efficiency significantly by managing credentials and delegating privileged actions.</p></div><div style='flex:0 0 50%;max-width:50%;overflow:hidden'><img src='https://krontech.com/_upload/descriptioncontentimages/6d2394910f50e9de1439a8089b4a91a4-5f0ce51ed6e28.jpg' alt='More Secure' style='width:100%;height:100%;min-height:280px;object-fit:cover;display:block'></div></div></div>");
            ptEn.setStatus(ContentStatus.PUBLISHED);
            ptEn.setPublishedAt(LocalDateTime.now());
            ptEn.setHowItWorksContent(p.length > 7 ? (String) p[7] : null);
            ptEn.setKeyBenefitsContent(p.length > 8 ? (String) p[8] : null);
            ptTr.setHowItWorksContent(p.length > 9 ? (String) p[9] : null);
            ptTr.setKeyBenefitsContent(p.length > 10 ? (String) p[10] : null);
            ptEn.setProductFamilyContent(p.length > 11 ? (String) p[11] : null);
            ptTr.setProductFamilyContent(p.length > 12 ? (String) p[12] : null);
            productTranslationRepository.save(ptEn);
        }

        Product pamKron = productRepository.findBySlug("pam-kron").orElse(null);
        if (pamKron != null) {
            List<String> pamChildren = List.of(
                    "password-vault",
                    "privileged-session-manager",
                    "multi-factor-authentication",
                    "endpoint-privileged-management",
                    "user-behavior-analytics",
                    "unified-access-manager"
            );
            for (String childSlug : pamChildren) {
                productRepository.findBySlug(childSlug).ifPresent(child -> {
                    child.setParent(pamKron);
                    productRepository.save(child);
                });
            }
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
        "<p>4G/5G mobil ağlarının yakınsaması ve Nesnelerin İnterneti'nin (IoT) patlaması, ağ güvenliğinde yeni bir standart talep ediyor. Modern, telco düzeyinde bir RADIUS AAA sunucusu, basit kimlik kontrollerinin ötesine geçmek zorunda. Kron AAA, özellikle Access Point Name (APN) farkındalığıyla güçlendirilmiş gelişmiş bir çok nitelikli güvenlik modeli sunuyor.</p><h2>Üç Boyutlu Erişim Kontrolü: Kimlik + Cihaz + APN</h2><p>Kron AAA'nın gelişmiş kimlik doğrulaması erişimi belirlemek için üç temel niteliği kullanıyor:</p><p><strong>1. Abone Kimliği (SIM/IMSI):</strong> Bağlanmaya çalışan kim. (Temel kontrol)</p><p><strong>2. Cihaz Kimliği (IMEI/MAC):</strong> Bağlantı hangi cihazdan geliyor. (Çift nitelik kontrolü)</p><p><strong>3. APN (Erişim Noktası Adı):</strong> Bağlantı nerede ve hangi amaçla yapılıyor. (Bağlamsal kontrol)</p><p>Bu üçlü doğrulama, doğru kimliğin, doğru cihazda, doğru ağ hizmetine bağlandığını garanti ediyor.</p><h2>APN Tabanlı Beyaz Liste ve Trafik Segmentasyonu</h2><p>Kurumsal IoT dağıtımları için güvenlik, trafiği Özel APN'lere yalıtarak güçlendiriliyor. Kron AAA, her güvenli bağlantı için SIM (IMSI) ve cihazı (IMEI) birbirine bağlayan ve ardından bunları yalnızca belirlenen erişim noktalarıyla kısıtlayan dijital bir parmak izi oluşturuyor. Bir kamu kuruluşunun Akıllı Şebeke sensörü yalnızca utilities.private.apn'i kullanmaya yetkili ise kötü niyetli bir kişi cihazı ele geçirip genel APN üzerinden bağlanmayı denese Kron AAA erişimi anında reddediyor.</p><h2>SIM/Cihaz Uyumsuzluğuyla Mücadele</h2><p>Bir SIM-Cihaz Uyumsuzluğu tespit edildiğinde (örneğin SIM takas girişimi), AAA nihai karar verici olarak devreye giriyor. IMSI onaylanmamış bir IMEI'de tespit edildiğinde güvenlik politikası anında Sert Reddetme uygulayabiliyor; bu sayede yetkisiz cihazların Özel IoT ağına herhangi bir şekilde erişim kazanması önleniyor.</p><h2>Sonuç</h2><p>Kron AAA'nın IMSI, IMEI, CLID ve APN gibi birden fazla değişkeni tek, yüksek hızlı bir RADIUS işleminde işleyebilme kapasitesi, gerçek anlamda Telco düzeyinde bir platformun göstergesidir. Bu çok nitelikli güvenlikten yararlanan ağ operatörleri, her bağlantının yalnızca doğrulanmış (SIM geçerli mi?) değil, aynı zamanda yetkili olduğunu (SIM doğru cihazda, doğru hizmete bağlanıyor mu?) bilerek IoT ekosistemlerini güvenle büyütebilir.</p>",
        "<p>The convergence of 4G/5G mobile networks and the explosion of the Internet of Things (IoT) demands a new standard in network security. A modern, telco-grade RADIUS Authentication, Authorization, and Accounting (AAA) server must move beyond simple identity checks. Kron AAA meets this challenge by introducing a sophisticated multi-attribute security model, now fortified with crucial Access Point Name (APN) Awareness.</p><h2>Three-Dimensional Access Control: ID + Device + APN</h2><p>Kron AAA's advanced authentication leverages three key attributes to determine access:</p><p><strong>1. Subscriber Identity (SIM/IMSI):</strong> Who is trying to connect. (The foundational check)</p><p><strong>2. Device Identity (IMEI/MAC):</strong> What device is the connection coming from. (The dual-attribute check)</p><p><strong>3. APN (Access Point Name):</strong> Where and for what purpose is the connection being made. (The contextual check)</p><p>This tri-fold validation ensures that the right identity, on the right device, is connecting to the right network service.</p><h2>APN-Based Whitelisting and Traffic Segmentation</h2><p>For enterprise IoT deployments, security is enhanced by isolating traffic onto Private APNs. Kron AAA creates a digital fingerprint for every secure connection that ties the SIM (IMSI) and the device (IMEI) together, then restricts them to only the designated access points. A utility company's Smart Grid sensor is only authorized to use the utility.private.apn — if a malicious actor tries to connect via the public APN, Kron AAA immediately denies access.</p><h2>Combating SIM/Device Mismatch</h2><p>When a SIM-Device Mismatch is detected, such as a SIM swap attempt, the AAA acts as the final decision maker. When an IMSI is detected on an unapproved IMEI, the security policy can impose an immediate Hard Reject, ensuring that unauthorized devices cannot gain any access to the Private IoT network.</p><h2>Kron AAA: The Foundation for Secure IoT</h2><p>Kron AAA's ability to process multiple variables — IMSI, IMEI, CLID, and APN — in a single, high-speed RADIUS transaction is the hallmark of a truly Telco-grade platform. By leveraging this multi-attribute security, network operators can confidently scale their IoT ecosystems, knowing that every connection is not only authenticated but also authorized — providing security resilience that is non-negotiable in the age of billions of connected devices.</p>"    },
    {
        "2026-siber-guvenlik-tahminleri",
        "https://krontech.com/_upload/blogimages/2026-cybersecurity-predictions-why-kron-pam-and-kron-dam-ddm-sit-at-the-center_blog.jpg",
        "2026-predictions-blog.jpg",
        "2026 Siber Güvenlik Tahminleri: Kron PAM ve Kron DAM/DDM Neden Merkezdedir?",
        "2026 Cybersecurity Predictions: Why Kron PAM and Kron DAM / DDM Sit at the Center",
        "2026 yılında siber güvenlik dünyasını şekillendirecek trendler ve Kron'un bu trendlerdeki rolü.",
        "Trends that will shape the cybersecurity world in 2026 and Kron's role in these trends.",
        "<p>Gartner'ın 2026 Siber Güvenlik Planlama Rehberi açık bir mesaj veriyor: siber güvenliğin ağırlık merkezi kimlik, erişim ve veri kontrolüne doğru kayıyor. Jeopolitik istikrarsızlık, yapay zeka iş akışları ve hibrit altyapılar saldırı yüzeyini genişletirken, kuruluşlar artık çevre savunmalarına veya parçalı araçlara güvenemez.</p><h2>2026 için Gartner'ın Beklentileri: Kimlik ve Veri Yeni Kontrol Düzlemi Olarak</h2><p>Gartner 2026 için altı büyük siber güvenlik trendi belirliyor; ancak rehber boyunca tekrar eden temalar şunlar: zero trust olgunluğu, veri merkezli güvenlik, saldırı yüzeyi azaltma ve maruz kalma yönetimi. Tüm bu konularda kimlik ve veri, giderek merkezsizleşen bir ortamda en güvenilir kontrol noktaları olarak ele alınıyor.</p><h2>Kron PAM ile Gartner'ın PAM Beklentilerini Karşılamak</h2><p>Gartner'ın zero trust olgunluk vizyonu, örtülü güveni — özellikle ayrıcalıklı kimlikler söz konusu olduğunda — ortadan kaldırmaya dayanıyor. Kron PAM, hibrit ve bulut-native ortamlarda kimlik öncelikli güvenliği operasyonel hale getirerek bu beklentiyle doğrudan örtüşüyor.</p><p>Statik yönetici hesaplarına güvenmek yerine Kron PAM, geçici ayrıcalık yükseltmesini zorunlu kılıyor; ayrıcalıklı erişim yalnızca açıkça gerektiğinde var oluyor ve ardından otomatik olarak iptal ediliyor.</p><h2>Kron DAM / DDM ile Gartner'ın Veri Merkezli Güvenlik Gerekliliğini Karşılamak</h2><p>PAM sistemlere kimin erişebileceğini kontrol ederken Gartner, veri erişiminin kontrol edilmesinin de 2026'da eşit derecede kritik olduğunu vurguluyor. Kron DAM / DDM, hassas verilerin ortamlar genelinde keşfedilmesi, sınıflandırılması ve sürekli izlenmesi çağrısına doğrudan yanıt veriyor.</p><h2>PAM ve DAM / DDM Birlikte: Maruz Kalma Yönetimini ve Dayanıklılığı Sağlamak</h2><p>Gartner'ın en güçlü mesajlarından biri, maruz kalma yönetiminin silolu güvenlik açığı yönetiminin yerini alması gerektiği yönünde. Gerçek dünyadaki riski anlamak, kimlikleri, erişim yollarını, veri hassasiyetini ve kullanım kalıplarını ilişkilendirmeyi gerektiriyor. Birlikte kullanıldığında Kron PAM ve Kron DAM / DDM tam da bu tür bağlamsal görünürlüğü sağlıyor.</p>",
        "<p>Gartner's 2026 Planning Guide for Cybersecurity makes one message unmistakably clear: the center of gravity in cybersecurity is shifting toward identity, access, and data control. As geopolitical instability, AI-driven workflows, and hybrid infrastructures expand attack surfaces; organizations can no longer rely on perimeter defenses or fragmented tooling. Instead, resilience in 2026 will be determined by how well enterprises control privileged access and data usage across humans, machines, and AI systems.</p><h2>Gartner's Expectations for 2026: Identity and Data as the New Control Plane</h2><p>Gartner identifies six major cybersecurity trends for 2026, but several themes recur consistently throughout the guide: zero trust maturity, data-centric security, attack surface reduction, and exposure management. Across all of them, identity and data are treated as the most reliable control points in an increasingly decentralized environment.</p><p>Gartner explicitly emphasizes identity-first security as a core security-by-design principle. Over-permissioned users, standing privileges, and lack of visibility into machine identities are highlighted as persistent weaknesses that enable ransomware, lateral movement, and account takeover attacks.</p><h2>Meeting Gartner's PAM Expectations With Kron PAM</h2><p>Gartner's vision of zero trust maturity hinges on eliminating implicit trust, especially privileged identities. Kron PAM aligns directly with this expectation by operationalizing identity-first security across hybrid and cloud-native environments. Rather than relying on static administrator accounts, Kron PAM enforces ephemeral privilege elevation, ensuring that privileged access exists only when explicitly required and is automatically revoked afterward.</p><h2>Addressing Gartner's Data-Centric Security Mandate with Kron DAM / DDM</h2><p>While PAM controls who can access systems, Gartner makes it clear that controlling data access is equally critical in 2026. Kron DAM / DDM directly maps to Gartner's call for discovery, classification, and continuous monitoring of sensitive data across environments. Gartner highlights the growing challenge of dark data — information organizations do not fully understand or track, yet which poses material breach and compliance risk.</p><h2>PAM and DAM / DDM Together: Enabling Exposure Management and Resilience</h2><p>One of Gartner's strongest messages is that exposure management must replace siloed vulnerability management. Used together, Kron PAM and Kron DAM / DDM create contextual visibility — privileged access events can be directly correlated with sensitive data access, allowing security teams to identify risky combinations before they are exploited. This aligns tightly with Gartner's Continuous Threat Exposure Management (CTEM) model.</p><h2>Looking Ahead to 2026</h2><p>Gartner's 2026 cybersecurity outlook does not call for more tools — it calls for better control of identity and data. PAM and DAM / DDM are no longer niche capabilities; they are foundational to zero trust, AI security, exposure management, and cyber resilience.</p>"    },
    {
        "guvenlik-duvarı-loglarini-ipdr-e-donusturme",
        "https://krontech.com/_upload/blogimages/turning-firewall-logs-into-ipdr-with-kron-telemetry-pipeline.jpg",
        "firewall-ipdr-blog.jpg",
        "Kron Telemetri Pipeline ile Güvenlik Duvarı Loglarını IPDR'a Dönüştürme",
        "Turning Firewall Logs into IPDR with Kron Telemetry Pipeline",
        "Kron Telemetri Pipeline, güvenlik duvarı loglarını sıfır kayıpla IPDR formatına dönüştürür.",
        "Kron Telemetry Pipeline converts firewall logs to IPDR format with zero loss.",
        "<h2>Zorluk</h2><p>Güvenlik duvarı günlükleri ağ etkinliğini izlemek, denetlemek ve analiz etmek için vazgeçilmezdir. Ancak ham güvenlik duvarı günlükleri genellikle yapılandırılmamış, satıcıya özgü ve ortamlar arasında tutarsızdır. Bu durum bunları abone veya kullanıcı etkinliğiyle ilişkilendirmeyi zorlaştırır. Türkiye'de 5651 Sayılı Kanun, günlük saklama, bütünlük koruması ve ağ etkinlik kayıtlarına denetlenebilir erişimi zorunlu kılmaktadır.</p><h2>Çözüm: Kron Telemetri Pipeline ile Yapılandırılmış Veri</h2><p>Kron Telemetri Pipeline, güvenlik duvarı günlüklerini hem düzenleyici hem de operasyonel ihtiyaçları karşılayan IPDR benzeri kayıtlara normalleştirmek, zenginleştirmek ve depolamak için satıcıdan bağımsız bir yol sunuyor.</p><p><strong>Ayrıştır ve Normalleştir:</strong> Ham güvenlik duvarı olayları SRC_IP, DST_IP, PORT, ACTION, BYTES_IN, BYTES_OUT, SESSION_DURATION ve PROTOCOL gibi anahtar alanları içeren tutarlı bir şemaya ayrıştırılıyor.</p><p><strong>Bağlamla Zenginleştir:</strong> 5651 korelasyon gereksinimleri için pipeline, güvenlik duvarı günlüklerini abone IP kiralama verileri (DHCP), kimlik doğrulama ayrıntıları (RADIUS) ve NAT çevirilerini kapsayan oturum düzeyi meta verilerle zenginleştiriyor.</p><p><strong>Zaman Damgası ve Bütünlük Kontrolü:</strong> Her kayıt hassas biçimde zaman damgalanıyor ve doğrulanabilir günlük bütünlüğünü desteklemek için dijital olarak imzalanıyor.</p><h2>Neden Önemlidir</h2><p>Güvenlik duvarı telemetrisini 5651 uyumluluk iş akışına entegre ederek Kron, manuel günlük dönüştürme veya satıcıya özgü dışa aktarma mekanizmaları ihtiyacını ortadan kaldırıyor. Operatörler ve işletmeler artık herhangi bir güvenlik duvarı satıcısından otomatik olarak 5651 uyumlu günlükler üretebilir, NAT ve RADIUS gibi ağ işlevleri genelinde abone etkinliğini ilişkilendirebilir ve düzenleyici denetimlere yapılandırılmış, kolayca alınabilir veri kümeleri aracılığıyla yanıt verebilir.</p>",
        "<h2>The Challenge</h2><p>Firewall logs are essential for tracking, auditing, and analyzing network activity. However, raw firewall logs are often unstructured, vendor-specific, and inconsistent across environments. This makes them difficult to correlate with subscriber or user activity. In Türkiye, Law No. 5651 mandates log retention, integrity protection, and auditable access to network activity records.</p><h2>The Solution: Structured Data from Firewall Logs with Kron Telemetry Pipeline</h2><p>The Kron Telemetry Pipeline provides a vendor-agnostic way to normalize, enrich, and store firewall logs into IPDR-like records that satisfy both regulatory and operational needs.</p><p><strong>Parse and Normalize:</strong> Raw firewall events are parsed into a consistent schema including key fields such as SRC_IP, DST_IP, PORT, ACTION, BYTES_IN, BYTES_OUT, SESSION_DURATION, and PROTOCOL.</p><p><strong>Enrich with Context:</strong> To meet 5651 correlation requirements, the pipeline enriches firewall logs with session-level metadata including subscriber IP lease data (from DHCP), authentication details (from RADIUS), and NAT translations for mapping public to private IPs.</p><p><strong>Timestamp and Integrity Control:</strong> Each record is precisely timestamped and digitally signed to support verifiable log integrity — an essential part of 5651 compliance.</p><h2>Why It Matters</h2><p>By integrating firewall telemetry into the 5651 compliance workflow, Kron eliminates the need for manual log conversion or vendor-specific export mechanisms. Operators and enterprises can automatically generate 5651-compliant logs from any firewall vendor, correlate subscriber activity across network functions such as NAT and RADIUS, and enable regulatory audits through structured, easily retrievable datasets.</p><h2>Summary</h2><p>Kron Telemetry Pipeline transforms traditional firewall logs into trusted regulatory evidence — ensuring full compliance with Türkiye's 5651 law while preserving operational efficiency. Firewall logs are more than a wall of text — they are valuable telemetry sources when processed right.</p>"    },
    {
        "oracle-rac-kron-dam-ddm",
        "https://krontech.com/_upload/blogimages/oracle-rac-simplified-how-kron-damddm-secures-multi-node-databases.png",
        "oracle-rac-blog.png",
        "Oracle RAC Basitleştirildi: Kron DAM&DDM Çok Düğümlü Veritabanlarını Nasıl Korur?",
        "Oracle RAC, Simplified: How Kron DAM&DDM Secures Multi-Node Databases",
        "Kron DAM ve DDM çözümleri Oracle RAC ortamlarında kapsamlı veritabanı güvenliği sağlar.",
        "Kron DAM and DDM solutions provide comprehensive database security in Oracle RAC environments.",
        "<p>Oracle RAC kümeleri, manuel düğüm bakımı olmaksızın denetlenebilir ve politika odaklı hale getirilebilir. Kron DAM&amp;DDM'de otomatik kayıt, küme farkındalıklı Veritabanı Güvenlik Duvarı ve gerçek zamanlı meta veri senkronizasyonu sunularak failover ve büyüme sırasında kontrollerin tutarlı kalması sağlanıyor.</p><h2>Bağlam ve Sorun Tanımı</h2><p>Oracle Real Application Clusters (RAC), elastiklik ve yüksek kullanılabilirlik için birden fazla örneğin tek bir veritabanına erişmesine olanak tanır. Ancak işletimsel yüzey hızla büyür: düğümler eklenir veya kullanım dışı bırakılır, hizmetler taşınır ve failover yaşanır. Günlükleme ve kontroller örnek başına kayar, politika değişiklikleri hizmet taşımalarının gerisinde kalır.</p><h2>Kron DAM&amp;DDM: Oracle RAC için Sunulanlar</h2><p>Kron DAM&amp;DDM, tüm örneklerde politikaları ve maskelemeyi tutarlı biçimde uygularken Oracle RAC için erişimi merkezileştiren küme farkındalıklı bir Veritabanı Güvenlik Duvarı sunuyor. RAC düğümleri proxy tarafından otomatik olarak kaydediliyor, böylece küme topolojisi değiştikçe manuel cihaz yönetimi ortadan kalkıyor.</p><h2>Sahada Gözlemlenenler</h2><p><strong>1) Yönetilmeyen düğümler:</strong> Çeyrek sonu ölçeğinde yeni bir RAC düğümü eklendi. SCAN üzerinden erişilebilir olmasına rağmen envantere alınmadı. Oturumlar yeni örnek tarafından işlenirken beklenen maskeleme ve reddetme kuralları düzgün uygulanmadı. Kron DAM&amp;DDM'nin otomatik kayıt özelliğiyle realm ataması otomatik olarak devralındı.</p><p><strong>2) Tutarsız günlükleme:</strong> Kümeli bir yama gerçekleştirildi ve hizmet başka bir örneğe taşındı. Sorgu günlükleri ve oturum ayrıntıları bir düğümde kaydedilirken devralınan düğümde boşluklar oluştu. Kron'un küme farkındalıklı Veritabanı Güvenlik Duvarı ile oturumlar tek bir proxy uç noktasına bağlandı, böylece günlükler failover boyunca kesintisiz kaldı.</p><h2>Sonuç</h2><p>Kron DAM&amp;DDM ile RAC ortamları daha görünür ve yönetilebilir hale geliyor. Otomatik kayıt manuel çalışmayı azaltıyor, küme farkındalıklı proxy failover boyunca tutarlı politikalar ve maskeleme sağlıyor, gerçek zamanlı günlükler tam hesap verebilirlik sunuyor.</p>",
        "<p>Oracle RAC clusters can be made auditable and policy-driven without manual node maintenance. Auto-registration, cluster-aware Database Firewall, and real-time metadata sync are delivered in Kron DAM&amp;DDM to keep controls consistent during failover and growth.</p><h2>Context and Problem Statement</h2><p>Oracle Real Application Clusters (RAC) enable multiple instances to access a single database for elasticity and high availability. However, the operational surface grows quickly: nodes are added or retired, services move, and failovers occur. Logging and controls drift per instance, and policy changes lag behind service relocation. During node failover or rolling maintenance, gaps appear in session auditability and masking enforcement.</p><h2>Kron DAM&amp;DDM: What Is Delivered for Oracle RAC</h2><p>Kron DAM&amp;DDM introduces a cluster-aware Database Firewall that centralizes access for Oracle RAC while enforcing policies and masking consistently across all instances. RAC nodes are auto-registered by the proxy, removing manual device administration as the cluster topology changes. Security controls are applied at the realm level, so one policy set governs all RAC instances.</p><h2>What Was Observed in the Field</h2><p><strong>1) Unmanaged nodes:</strong> During a quarter-end scale-out, a new RAC node was added. It was reachable through SCAN, but not onboarded in the inventory. Sessions were handled by the new instance while expected masking and deny rules were not applied uniformly. Addressed by auto-registration — realm assignment carried over automatically.</p><p><strong>2) Inconsistent logging:</strong> A rolling patch was performed and the service moved to another instance. Query logs were recorded on one node but gaps appeared on the node that took over. Addressed by the cluster-aware Database Firewall — sessions were anchored on a single proxy endpoint, so logs stayed continuous across failover.</p><h2>Conclusion</h2><p>With Kron DAM&amp;DDM, RAC environments are made more visible and manageable. Auto-registration reduces manual work, cluster-aware proxying maintains consistent policies and masking through failover, and real-time logs provide full accountability.</p>"    },
    {
        "kubernetes-telemetri",
        "https://krontech.com/_upload/blogimages/unifying-kubernetes-telemetry-in-a-diverse-and-fragmented-collector-world_blog.png",
        "kubernetes-telemetry-blog.png",
        "Çeşitli ve Parçalı Toplayıcı Dünyasında Kubernetes Telemetrisini Birleştirme",
        "Unifying Kubernetes Telemetry in a Diverse and Fragmented Collector World",
        "Kubernetes ortamlarında dağınık telemetri verilerini merkezi olarak yönetmenin yolları.",
        "Ways to centrally manage scattered telemetry data in Kubernetes environments.",
        "<h2>Kubernetes Ortamları Neden Varsayılan Olarak Çeşitleniyor?</h2><p>Kubernetes özerkliği ve mikroservis düzeyinde sorumluluğu teşvik eder. Kuruluşlar büyüdükçe platform mühendisliği düğümler için temel bir toplayıcı belirlerken (genellikle Fluent Bit), yüksek performanslı iş yükleri öngörülebilir bellek kullanımı ve Rust düzeyinde verim nedeniyle Vector'ü tercih eder. SRE ekipleri günlükleri, metrikleri ve izleri birleştirmek için OpenTelemetry Collector'ı benimser.</p><p>Sonuç öngörülebilir: Küme A → Fluent Bit, Küme B → OTel Collector, Küme C → Vector ve özel sidecar'lar. Tek bir ajanı bu çeşitlilik üzerine empoze etmek, mevcut DaemonSet'lerin ve ConfigMap'lerin yeniden yazılmasını, uygulama tarafı yayıcıların zorla yeniden düzenlenmesini gerektiriyor.</p><h2>Kron TLMP ile Agnostik Alım Katmanı</h2><p>Kron Telemetri Pipeline, toplayıcıları birbirinin yerine geçebilir uç bileşenler olarak ele alarak bu sorunu çözüyor. Desteklenen giriş protokolleri arasında Fluent Bit/Fluentd Forward, Vector sink'leri (TCP/HTTP/JSON), OTLP/OTLP-gRPC/OTLP-HTTP ve özel TCP/HTTP yapılandırılmış log formatları yer alıyor.</p><h2>Şema Kaymasını Çözme</h2><p>Karışık toplayıcı ortamındaki birincil zorluk alım değil, şema kaymasıdır. Farklı ajanlar farklı yapılar üretir: Fluent Bit kubernetes.pod_name ve Unix zaman damgası kullanırken, Vector RFC3339 zaman damgaları ve düzleştirilmiş alanlar, OTel ise k8s.pod.name ve kaynak nitelikleri kullanır. Kron TLMP tüm telemetri verilerinin depolamadan önce birleşik bir formata uymasını sağlayarak şema yönetimini merkezileştirir.</p><h2>Sonuç</h2><p>Kubernetes gözlemlenebilirliği özünde parçalı ve karışıktır. Kron Telemetri Pipeline, Kubernetes-native, standartlardan bağımsız bir çözüm sunarak herhangi bir toplayıcıyı kabul etmeyi, tüm akışları normalleştirip zenginleştirmeyi ve aşağı akış tutarlılığını korumayı mümkün kılıyor.</p>",
        "<h2>Why Kubernetes Environments Become Diverse by Default</h2><p>Kubernetes encourages autonomy and microservice-level responsibility. As organizations scale, platform engineering mandates a baseline collector for nodes (commonly Fluent Bit), performance-heavy workloads prefer Vector due to its predictable memory usage, and SRE teams adopt OpenTelemetry Collector to unify logs, metrics, and traces.</p><p>The outcome is predictable: Cluster A uses Fluent Bit, Cluster B uses OTel Collector, Cluster C runs Vector and custom sidecars. Attempting to impose a single agent across this diversity results in deployment bottlenecks, rewrites of existing DaemonSets, and forced refactoring of application-side emitters.</p><h2>Agnostic Ingress Layer with Kron TLMP</h2><p>Kron Telemetry Pipeline addresses this problem by treating collectors as interchangeable edge components. It provides a vendor-neutral, Kubernetes-native telemetry ingress layer that unifies logs regardless of the agent producing them. Supported input protocols include Fluent Bit/Fluentd Forward, Vector sinks (TCP/HTTP/JSON), OTLP/OTLP-gRPC/OTLP-HTTP, and custom TCP/HTTP structured log formats.</p><h2>Resolving Schema Drift</h2><p>The primary challenge in a mixed collector environment is not ingestion — it is schema drift. Different agents produce different structures: Fluent Bit uses kubernetes.pod_name and Unix timestamps, Vector uses RFC3339 timestamps and flattened fields, while OTel uses k8s.pod.name and resource attributes. Kron TLMP centralizes schema governance, ensuring all telemetry data conforms to a unified format before storage.</p><h2>Pipeline Behavior</h2><p>Kron TLMP implements a three-phase architecture: ingest everything, harmonize the differences, and enrich with the context your observability backend needs. This ensures that every collector flows through the same predictable pipeline regardless of origin.</p><h2>Conclusion</h2><p>Kubernetes observability is inherently fragmented and mixed. Kron Telemetry Pipeline provides a Kubernetes-native, standards-agnostic solution: accept any collector, normalize and enrich all streams, preserve downstream consistency, and enable future upgrades without forced migrations.</p>"    },
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
                        "pam-kron",
                        "https://krontech.com/_upload/listimages/kron_pam_thumb.png"
                },
                {
                        "password-vault-datasheet", "datasheet",
                        "Password Vault Datasheet", "Password Vault Datasheet",
                        "Şifre Kasası çözümünün teknik özelliklerini içeren datasheet.",
                        "Technical specifications for the Password Vault solution.",
                        "pam-kron",
                        "https://krontech.com/_upload/listimages/thumnail_datasheet_password_vault.jpg"
                },
                {
                        "privileged-session-manager-datasheet", "datasheet",
                        "Session Manager Datasheet", "Session Manager Datasheet",
                        "Ayrıcalıklı Oturum Yöneticisi çözümünün teknik özelliklerini içeren datasheet.",
                        "Technical specifications for the Privileged Session Manager solution.",
                        "pam-kron",
                        "https://krontech.com/_upload/listimages/thumnail_datasheet_psm.jpg"
                },
                {
                        "mfa-datasheet", "datasheet",
                        "MFA Datasheet", "Multi-Factor Authentication Datasheet",
                        "Çok Faktörlü Kimlik Doğrulama çözümünün teknik özelliklerini içeren datasheet.",
                        "Technical specifications for the Multi-Factor Authentication solution.",
                        "pam-kron",
                        "https://krontech.com/_upload/listimages/thumnail_datasheet_Kron_MFA.jpg"
                },
                {
                        "unified-access-manager-datasheet", "datasheet",
                        "UAM Datasheet", "Unified Access Manager Datasheet",
                        "Birleşik Erişim Yöneticisi çözümünün teknik özelliklerini içeren datasheet.",
                        "Technical specifications for the Unified Access Manager solution.",
                        "pam-kron",
                        "https://krontech.com/_upload/listimages/thumnail_datasheet_Kron_UAM.jpg"
                },
        };

    for (Object[] r : resources) {
        Resource resource = new Resource();
        resource.setSlug((String) r[0]);
        resource.setType((String) r[1]);
        resource.setActive(true);


        // featured image
        if (r.length > 7 && r[7] != null) {
            Media media = new Media();
            media.setUrl((String) r[7]);
            media.setFilename((String) r[0] + ".jpg");
            media.setMimeType("image/jpeg");
            media.setAltText((String) r[3]);
            media.setUploadedBy(userRepository.findByEmail(adminEmail).orElseThrow());
            media = mediaRepository.save(media);
            resource.setFeaturedImage(media);
        }

        // relatedProduct bağla
        if (r[6] != null) {
            productRepository.findBySlug((String) r[6]).ifPresent(resource::setRelatedProduct);
        }


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