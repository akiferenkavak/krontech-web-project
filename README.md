# Krontech Web — Redesign Project

A full-stack redesign of the Krontech Technologies corporate website, built with Spring Boot 4 and Next.js 16. The system starts with a single command via Docker Compose.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend | Spring Boot 4, Java 21 | See [Backend Selection](#backend-technology-selection) |
| Frontend | Next.js 16, TypeScript | SSR/ISR, App Router, multilingual routing |
| Database | PostgreSQL 16 | Relational data model, JSONB support |
| Cache | Redis 7 | Spring Cache + Bucket4j rate limiting |
| Auth | JWT + HttpOnly Cookie | See [Auth Selection](#authentication-selection) |
| API | REST | See [API Selection](#api-design-rest-vs-graphql) |
| Container | Docker, Docker Compose | Single-command local development |
| Testing | JUnit 5, Mockito, Testcontainers, Vitest | See [Testing](#testing) |

---

## Quick Start

### Requirements

- **Docker Desktop** (Windows/Mac) or **Docker Engine + Docker Compose** (Linux)
- **Git**
- Docker Desktop must be running

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/krontech-web-project.git
cd krontech-web-project

# 2. Configure environment variables
cp .env.example .env
# Edit .env — at minimum change the passwords
# Required: JWT_SECRET (min 32 chars), POSTGRES_PASSWORD, REDIS_PASSWORD

# 3. Start all services
docker compose up --build
```

Once all services are ready (after backend health check passes ~60 seconds):

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Admin Panel | http://localhost:3000/admin |

### Admin Login

Use the `APP_ADMIN_EMAIL` and `APP_ADMIN_PASSWORD` values from your `.env` file.

```
Default email:    admin@krontech.com
Password:         set in APP_ADMIN_PASSWORD (.env)
```

### Stop Services

```bash
# Stop services
docker compose down

# Stop services and reset database
docker compose down -v
```

---

## Project Structure

```
krontech-web-project/
├── docker-compose.yml            # All services (postgres, redis, backend, frontend)
├── .env.example                  # Environment variable template
├── README.md
│
├── backend/                      # Spring Boot 4 REST API
│   ├── Dockerfile                # Multi-stage build (Maven → JRE Alpine)
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/krontech/backend/
│       │   ├── controller/       # REST endpoints
│       │   ├── service/          # Business logic
│       │   ├── entity/           # JPA entities
│       │   ├── dto/              # Request/Response DTOs
│       │   ├── repository/       # Spring Data JPA repositories
│       │   ├── security/         # JWT filter, JwtService
│       │   └── config/           # SecurityConfig, CacheConfig, RateLimitConfig
│       ├── main/resources/
│       │   └── application.yml
│       └── test/
│           ├── java/             # Unit and integration tests
│           └── resources/
│               └── application-test.yml
│
└── frontend/                     # Next.js 16 application
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/
        │   ├── [locale]/         # Public site (TR/EN) — App Router
        │   │   ├── page.tsx      # Home page
        │   │   ├── blog/         # Blog list + detail
        │   │   ├── products/     # Product category + detail (tabbed)
        │   │   ├── resources/    # Resources (datasheet, whitepaper)
        │   │   ├── contact/      # Contact form
        │   │   └── request-demo/ # Demo request form
        │   ├── admin/            # CMS admin panel
        │   │   ├── login/
        │   │   └── (shell)/      # Dashboard, Blog, Products, Resources, Submissions
        │   ├── api/revalidate/   # ISR revalidation endpoint
        │   ├── sitemap.ts        # Dynamic sitemap
        │   └── robots.ts
        ├── components/           # UI components
        ├── lib/
        │   ├── api.ts            # Public API client
        │   └── admin-api.ts      # Admin API client
        └── i18n/config.ts        # Locale configuration
```

---

## Technical Decisions and Rationale

### Backend Technology Selection

**Spring Boot 4 (Java 21) selected — NestJS rejected.**

| Criteria | Spring Boot 4 | NestJS |
|----------|--------------|--------|
| Maturity | Production-grade, 10+ years | Newer ecosystem |
| Type Safety | Java compile-time | TypeScript, runtime errors possible |
| ORM | JPA/Hibernate — powerful, JPQL | TypeORM/Prisma — less mature |
| Security | Spring Security — comprehensive | Passport.js — more manual |
| Testability | JUnit 5 + Testcontainers ecosystem | Jest ecosystem |
| Java 21 | Virtual Threads, Records, Pattern Matching | — |

The project's complex relational data model (multilingual content, hierarchical product structure) requires Spring Data JPA's powerful query support. Setting up JWT + HttpOnly Cookie auth with Spring Security required significantly less boilerplate compared to NestJS.

### Authentication Selection

**JWT + HttpOnly Cookie selected — Session/OAuth rejected.**

- **HttpOnly Cookie**: Inaccessible to JavaScript, protects against XSS attacks. CSRF protection added with `SameSite=Strict`.
- **JWT (Stateless)**: No session store needed when scaling. Each node can verify tokens independently.
- **Why not localStorage**: Can be stolen via XSS. HttpOnly Cookie is significantly more secure.
- **Bearer fallback for Swagger**: `Authorization: Bearer <token>` header also supported (for API testing).

Token expiry is configurable via `.env` (`JWT_EXPIRATION_MS`, default 24 hours).

### API Design: REST vs GraphQL

**REST selected — GraphQL rejected.**

- **Simplicity**: The frontend consumes only a few resources (products, blog-posts, forms, resources). The complexity GraphQL introduces (schema, resolvers, N+1 problem) is overkill for this project.
- **Cache compatibility**: REST endpoints integrate naturally with Next.js ISR. `fetch` caching and `revalidatePath` work over REST URLs.
- **Swagger/OpenAPI**: `springdoc-openapi` integration works out of the box with REST. GraphQL requires separate tooling.

API documentation: http://localhost:8080/swagger-ui.html

### Cache Strategy

Three-layer cache architecture:

```
Client → Next.js ISR Cache → Redis (Spring Cache) → PostgreSQL
```

1. **Next.js ISR**: Product and blog pages cached with `revalidate`. When content is published, backend triggers `/api/revalidate`.
2. **Redis (Spring Cache)**: `@Cacheable` at the service layer with 1-hour TTL. `@CacheEvict` automatically clears cache when content is updated.
3. **Cache Invalidation Flow**: Content saved in admin panel → Service `@CacheEvict` runs → `RevalidationService` POSTs to frontend → Next.js ISR cache cleared.

### Rate Limiting

Distributed rate limiting with Bucket4j + Redis:

| Endpoint | Limit |
|----------|-------|
| `POST /auth/login` | 10 requests / 5 minutes (brute force protection) |
| `POST /forms/submit` | 5 requests / 15 minutes (spam protection) |
| General API | 300 requests / minute |

### SEO and GEO

**SEO:**
- Dynamic `title`, `description`, `og:*` tags via `generateMetadata` per page
- `hreflang` alternates (TR/EN)
- Dynamic `sitemap.ts` — products and blog posts added automatically
- `robots.ts` — admin and API paths `disallow`
- Canonical URL support (`canonicalUrl` field in ProductTranslation entity)

**GEO (Generative Engine Optimization):**
- `structuredData` (JSON-LD) field in every content entity
- `Article` schema auto-generated for blog posts (`/[locale]/blog/[slug]/page.tsx`)
- Semantic HTML structure (`<article>`, `<nav>`, `<main>`, `<section>`)
- Meaningful content blocks readable by LLMs

### Test Framework Selection

**Backend: JUnit 5 + Mockito + Testcontainers**
- JUnit 5: Native integration with the Spring Boot ecosystem
- Mockito: Dependency isolation, clean unit tests with `@InjectMocks`
- Testcontainers: Integration tests with real PostgreSQL and Redis — used instead of H2 in-memory DB because JSONB and PostgreSQL-specific features need to be tested

**Frontend: Vitest + React Testing Library**
- Vitest: Vite-based, better compatibility with Next.js 16 + ESM than Jest
- RTL: User behavior-focused testing (not tied to implementation details)

---

## Features

### Public Site

- **Multilingual content** (TR/EN) — `/tr/...` and `/en/...` routing
- **Product catalog** — tabbed detail pages (Solution, How It Works, Key Benefits, Product Family, Resources)
- **Blog** — list, detail, featured posts, social media share buttons
- **Resources** — datasheet, whitepaper, case study (filter by type)
- **Forms** — Demo Request and Contact (schema-driven, KVKK consent, reCAPTCHA v2)
- **Footer form** — dark theme, inline submission

### Admin Panel (CMS)

- **Secure auth** — HttpOnly cookie, `/admin/*` route protection
- **Blog management** — TipTap WYSIWYG editor, TR/EN translation tabs
- **Product management** — 4 content tabs (Solution, How It Works, Key Benefits, Product Family), SEO fields
- **Resource management** — type, related product, file URL, thumbnail
- **Form submissions** — list, detail modal, status update, CSV export
- **Dashboard** — statistics cards

### Publishing Workflow

- **Draft/Publish** — `ContentStatus` enum (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED)
- **ISR Revalidation** — Next.js cache automatically cleared when content is published

---

## API Documentation

Swagger UI: http://localhost:8080/swagger-ui.html

### Key Endpoints

```
# Public
GET  /api/v1/products?lang=en
GET  /api/v1/products/slug/{slug}
GET  /api/v1/blog-posts?lang=en&page=0&size=10
GET  /api/v1/blog-posts/slug/{slug}
GET  /api/v1/blog-posts/featured?lang=en
GET  /api/v1/resources?lang=en&type=datasheet
GET  /api/v1/forms/{slug}
POST /api/v1/forms/submit

# Admin (JWT required)
GET/PUT /api/v1/products/{id}
GET/PUT /api/v1/blog-posts/{id}
GET/PUT /api/v1/admin/resources/{id}
GET     /api/v1/admin/forms/{formId}/submissions
GET     /api/v1/admin/forms/{formId}/submissions/export
```

---

## Testing

### Backend

```bash
cd backend

# Run all tests (Docker Desktop must be running — required for Testcontainers)
./mvnw test
```

**Test coverage (44 tests):**

| Test Class | Type | Coverage |
|------------|------|----------|
| `ProductServiceTest` | Unit | CRUD, error cases |
| `BlogPostServiceTest` | Unit | Pagination, featured, translations |
| `JwtServiceTest` | Unit | Token generation, validation, expiry |
| `RecaptchaServiceTest` | Unit | Google API integration, error scenarios |
| `ProductControllerIntegrationTest` | Integration | REST endpoints, real DB |
| `BlogPostControllerIntegrationTest` | Integration | Pagination, slug lookup |
| `FormControllerIntegrationTest` | Integration | Validation, 400/404 scenarios |
| `BackendApplicationTests` | Integration | Spring context loading |

### Frontend

```bash
cd frontend

# Run tests
npm run test:run

# Coverage report
npm run test:coverage
```

**Test coverage (17 tests):**

| Test File | Coverage |
|-----------|----------|
| `api.test.ts` | API client — endpoints, error cases |
| `BlogList.test.tsx` | Render, links, pagination, locale |

---

## Environment Variables

Copy `.env.example` to create `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | PostgreSQL password | — (required) |
| `REDIS_PASSWORD` | Redis password | — (required) |
| `JWT_SECRET` | JWT signing key (min 32 chars) | — (required) |
| `JWT_EXPIRATION_MS` | Token expiry (ms) | `86400000` (24h) |
| `APP_ADMIN_EMAIL` | Default admin email | `admin@krontech.com` |
| `APP_ADMIN_PASSWORD` | Default admin password | — (required) |
| `APP_COOKIE_SECURE` | HTTPS cookie (prod: true) | `false` |
| `NEXT_PUBLIC_API_URL` | Frontend → Backend URL | `http://localhost:8080/api/v1` |
| `REVALIDATE_SECRET` | ISR revalidation secret | — (required) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 site key | — |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v2 secret key | — |

---

## Development Notes

### Database

Schema updates automatically with `ddl-auto: update`. On first start, `DataInitializer` creates seed data:
- 11 products (PAM Kron + sub-modules, Data Security, Network Security, DAM, AAA)
- 12 blog posts (TR/EN translations)
- 2 form definitions (contact, demo-request)
- 5 resources (datasheets)

### Hot Reload

Source files in the frontend container are bound via volume mount. `WATCHPACK_POLLING=true` ensures changes are detected on Windows as well.

### Environment Profiles

- `application.yml` — production defaults
- `application-test.yml` — test profile (used with Testcontainers, cache disabled)

### AI Usage

Claude (Anthropic) was actively used throughout this project:
- Entity model and relationship design
- Spring Security + JWT implementation
- Next.js App Router multilingual routing structure
- Testcontainers integration test setup
- TipTap editor integration
- SEO/GEO metadata structure

AI outputs were not copied directly; every output was evaluated against project requirements, adapted, and tested.

---

---

# Krontech Web — Yeniden Geliştirme Projesi

Krontech Technologies kurumsal web sitesinin tam yığın yeniden geliştirilmesi. Spring Boot 4 tabanlı REST API, Next.js 16 frontend ve Docker Compose ile tek komutta ayağa kalkan bir sistem.

## Tech Stack

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Backend | Spring Boot 4, Java 21 | Bkz. [Backend Seçimi](#backend-teknoloji-seçimi) |
| Frontend | Next.js 16, TypeScript | SSR/ISR, App Router, çok dilli routing |
| Veritabanı | PostgreSQL 16 | İlişkisel veri modeli, JSONB desteği |
| Cache | Redis 7 | Spring Cache + Bucket4j rate limiting |
| Auth | JWT + HttpOnly Cookie | Bkz. [Auth Seçimi](#authentication-seçimi) |
| API | REST | Bkz. [API Seçimi](#api-tasarımı-rest-vs-graphql) |
| Container | Docker, Docker Compose | Tek komutla yerel geliştirme ortamı |
| Test | JUnit 5, Mockito, Testcontainers, Vitest | Bkz. [Test](#test) |

---

## Hızlı Başlangıç

### Gereksinimler

- **Docker Desktop** (Windows/Mac) veya **Docker Engine + Docker Compose** (Linux)
- **Git**
- Docker Desktop açık ve çalışır durumda olmalı

### Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/your-username/krontech-web-project.git
cd krontech-web-project

# 2. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle — en azından şifreleri değiştir
# Zorunlu: JWT_SECRET (min 32 karakter), POSTGRES_PASSWORD, REDIS_PASSWORD

# 3. Tüm servisleri başlat
docker compose up --build
```

Servisler hazır olduğunda (backend health check geçtikten sonra ~60 saniye):

| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Admin Panel | http://localhost:3000/admin |

### Admin Girişi

`.env` dosyasındaki `APP_ADMIN_EMAIL` ve `APP_ADMIN_PASSWORD` değerleriyle giriş yapılır.

```
Varsayılan e-posta:  admin@krontech.com
Şifre:              .env dosyasında APP_ADMIN_PASSWORD
```

### Servisleri Durdurma

```bash
# Servisleri durdur
docker compose down

# Servisleri durdur ve veritabanını sıfırla
docker compose down -v
```

---

## Proje Yapısı

```
krontech-web-project/
├── docker-compose.yml            # Tüm servisler (postgres, redis, backend, frontend)
├── .env.example                  # Ortam değişkeni şablonu
├── README.md
│
├── backend/                      # Spring Boot 4 REST API
│   ├── Dockerfile                # Multi-stage build (Maven → JRE Alpine)
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/krontech/backend/
│       │   ├── controller/       # REST endpoint'leri
│       │   ├── service/          # İş mantığı
│       │   ├── entity/           # JPA entity'leri
│       │   ├── dto/              # Request/Response DTO'ları
│       │   ├── repository/       # Spring Data JPA repository'leri
│       │   ├── security/         # JWT filter, JwtService
│       │   └── config/           # SecurityConfig, CacheConfig, RateLimitConfig
│       ├── main/resources/
│       │   └── application.yml
│       └── test/
│           ├── java/             # Unit ve integration testler
│           └── resources/
│               └── application-test.yml
│
└── frontend/                     # Next.js 16 uygulaması
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/
        │   ├── [locale]/         # Public site (TR/EN) — App Router
        │   │   ├── page.tsx      # Ana sayfa
        │   │   ├── blog/         # Blog liste + detay
        │   │   ├── products/     # Ürün kategori + detay (sekmeli)
        │   │   ├── resources/    # Kaynaklar (datasheet, whitepaper)
        │   │   ├── contact/      # İletişim formu
        │   │   └── request-demo/ # Demo talep formu
        │   ├── admin/            # CMS admin paneli
        │   │   ├── login/
        │   │   └── (shell)/      # Dashboard, Blog, Products, Resources, Submissions
        │   ├── api/revalidate/   # ISR revalidation endpoint
        │   ├── sitemap.ts        # Dinamik sitemap
        │   └── robots.ts
        ├── components/           # UI bileşenleri
        ├── lib/
        │   ├── api.ts            # Public API client
        │   └── admin-api.ts      # Admin API client
        └── i18n/config.ts        # Locale konfigürasyonu
```

---

## Teknik Kararlar ve Gerekçeler

### Backend Teknoloji Seçimi

**Spring Boot 4 (Java 21) seçildi — NestJS reddedildi.**

| Kriter | Spring Boot 4 | NestJS |
|--------|--------------|--------|
| Olgunluk | Production-grade, 10+ yıl | Daha yeni ekosistem |
| Type Safety | Java compile-time | TypeScript, runtime hataları mümkün |
| ORM | JPA/Hibernate — güçlü, JPQL | TypeORM/Prisma — daha az olgun |
| Security | Spring Security — kapsamlı | Passport.js — daha manuel |
| Testability | JUnit 5 + Testcontainers ekosistemi | Jest ekosistemi |
| Java 21 | Virtual Threads, Records, Pattern Matching | — |

Projenin karmaşık ilişkisel veri modeli (çok dilli içerik, hiyerarşik ürün yapısı), Spring Data JPA'nın güçlü sorgu desteğini gerektiriyor. Spring Security ile JWT + HttpOnly Cookie auth kurmak NestJS'e göre çok daha az boilerplate gerektirdi.

### Authentication Seçimi

**JWT + HttpOnly Cookie seçildi — Session/OAuth reddedildi.**

- **HttpOnly Cookie**: JavaScript'ten erişilemez, XSS saldırılarına karşı koruma sağlar. `SameSite=Strict` ile CSRF koruması eklendi.
- **JWT (Stateless)**: Backend scale edildiğinde session store gerekmez. Her node token'ı bağımsız doğrulayabilir.
- **Neden localStorage değil**: XSS ile çalınabilir, HttpOnly Cookie çok daha güvenli.
- **Swagger için Bearer fallback**: `Authorization: Bearer <token>` header'ı da destekleniyor (API testleri için).

Token süresi `.env` üzerinden konfigüre edilebilir (`JWT_EXPIRATION_MS`, varsayılan 24 saat).

### API Tasarımı: REST vs GraphQL

**REST seçildi — GraphQL reddedildi.**

- **Basitlik**: Frontend sadece birkaç kaynak tüketiyor (products, blog-posts, forms, resources). GraphQL'nin getirdiği karmaşıklık (schema, resolver, N+1 sorunu) bu proje için overkill.
- **Cache uyumluluğu**: REST endpoint'leri Next.js ISR ile doğal uyum sağlıyor. `fetch` caching ve `revalidatePath` REST URL'leri üzerinden çalışıyor.
- **Swagger/OpenAPI**: REST ile `springdoc-openapi` entegrasyonu kutudan çıkar. GraphQL için ayrı araç gerekir.

API dokümantasyonu: http://localhost:8080/swagger-ui.html

### Cache Stratejisi

Üç katmanlı cache yapısı:

```
İstemci → Next.js ISR Cache → Redis (Spring Cache) → PostgreSQL
```

1. **Next.js ISR**: Ürün ve blog sayfaları `revalidate` ile cache'leniyor. İçerik publish edildiğinde backend `/api/revalidate` endpoint'ini tetikliyor.
2. **Redis (Spring Cache)**: `@Cacheable` ile servis katmanında 1 saatlik TTL. `@CacheEvict` ile içerik güncellendiğinde otomatik temizleniyor.
3. **Cache Invalidation Akışı**: Admin panelden içerik kaydedilir → Service `@CacheEvict` çalışır → `RevalidationService` frontend'e POST atar → Next.js ISR cache temizlenir.

### Rate Limiting

Bucket4j + Redis ile dağıtık rate limiting:

| Endpoint | Limit |
|----------|-------|
| `POST /auth/login` | 10 istek / 5 dakika (brute force koruması) |
| `POST /forms/submit` | 5 istek / 15 dakika (spam koruması) |
| Genel API | 300 istek / dakika |

### SEO ve GEO

**SEO:**
- Her sayfa için `generateMetadata` ile dinamik `title`, `description`, `og:*` tag'leri
- `hreflang` alternates (TR/EN)
- Dinamik `sitemap.ts` — ürünler ve blog yazıları otomatik ekleniyor
- `robots.ts` — admin ve API yolları `disallow`
- Canonical URL desteği (ProductTranslation entity'sinde `canonicalUrl` alanı)

**GEO (Generative Engine Optimization):**
- Her içerik entity'sinde `structuredData` (JSON-LD) alanı
- Blog yazıları için `Article` schema otomatik üretiliyor (`/[locale]/blog/[slug]/page.tsx`)
- Semantik HTML yapısı (`<article>`, `<nav>`, `<main>`, `<section>`)
- LLM'lerin anlayabileceği anlamlı içerik blokları

### Test Framework Seçimi

**Backend: JUnit 5 + Mockito + Testcontainers**
- JUnit 5: Spring Boot ekosistemi ile native entegrasyon
- Mockito: Bağımlılık izolasyonu, `@InjectMocks` ile temiz unit test yazımı
- Testcontainers: Gerçek PostgreSQL ve Redis ile integration test — H2 in-memory DB yerine kullanıldı çünkü JSONB ve PostgreSQL'e özgü özellikler test edilmesi gerekiyor

**Frontend: Vitest + React Testing Library**
- Vitest: Vite tabanlı, Next.js 16 + ESM ile Jest'ten daha iyi uyumluluk
- RTL: Kullanıcı davranışı odaklı test (implementation detail'e bağımlı değil)

---

## Özellikler

### Public Site

- **Çok dilli içerik** (TR/EN) — `/tr/...` ve `/en/...` routing
- **Ürün kataloğu** — sekmeli detay sayfaları (Solution, How It Works, Key Benefits, Product Family, Resources)
- **Blog** — liste, detay, öne çıkanlar, sosyal medya paylaşım butonları
- **Kaynaklar** — datasheet, whitepaper, case study (tip bazlı filtreleme)
- **Formlar** — Demo Talep ve İletişim (schema-driven, KVKK onayı, reCAPTCHA v2)
- **Footer formu** — dark tema, inline gönderim

### Admin Panel (CMS)

- **Güvenli auth** — HttpOnly cookie, `/admin/*` route koruması
- **Blog yönetimi** — TipTap WYSIWYG editör, TR/EN çeviri sekmeleri
- **Ürün yönetimi** — 4 içerik sekmesi (Solution, How It Works, Key Benefits, Product Family), SEO alanları
- **Kaynak yönetimi** — tip, ilgili ürün, dosya URL, thumbnail
- **Form gönderimleri** — liste, detay modal, durum güncelleme, CSV export
- **Dashboard** — istatistik kartları

### Yayın Süreci

- **Draft/Publish** — `ContentStatus` enum (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED)
- **ISR Revalidation** — içerik publish edildiğinde Next.js cache otomatik temizleniyor

---

## API Dokümantasyonu

Swagger UI: http://localhost:8080/swagger-ui.html

### Temel Endpoint'ler

```
# Public
GET  /api/v1/products?lang=en
GET  /api/v1/products/slug/{slug}
GET  /api/v1/blog-posts?lang=en&page=0&size=10
GET  /api/v1/blog-posts/slug/{slug}
GET  /api/v1/blog-posts/featured?lang=en
GET  /api/v1/resources?lang=en&type=datasheet
GET  /api/v1/forms/{slug}
POST /api/v1/forms/submit

# Admin (JWT gerektirir)
GET/PUT /api/v1/products/{id}
GET/PUT /api/v1/blog-posts/{id}
GET/PUT /api/v1/admin/resources/{id}
GET     /api/v1/admin/forms/{formId}/submissions
GET     /api/v1/admin/forms/{formId}/submissions/export
```

---

## Test

### Backend

```bash
cd backend

# Tüm testleri çalıştır (Docker Desktop açık olmalı — Testcontainers için)
./mvnw test
```

**Test kapsamı (44 test):**

| Test Sınıfı | Tür | Kapsam |
|-------------|-----|--------|
| `ProductServiceTest` | Unit | CRUD, hata durumları |
| `BlogPostServiceTest` | Unit | Sayfalama, featured, çeviri |
| `JwtServiceTest` | Unit | Token üretimi, doğrulama, expiry |
| `RecaptchaServiceTest` | Unit | Google API entegrasyonu, hata senaryoları |
| `ProductControllerIntegrationTest` | Integration | REST endpoint'leri, gerçek DB |
| `BlogPostControllerIntegrationTest` | Integration | Pagination, slug lookup |
| `FormControllerIntegrationTest` | Integration | Validasyon, 400/404 senaryoları |
| `BackendApplicationTests` | Integration | Spring context yükleme |

### Frontend

```bash
cd frontend

# Testleri çalıştır
npm run test:run

# Coverage raporu
npm run test:coverage
```

**Test kapsamı (17 test):**

| Test Dosyası | Kapsam |
|-------------|--------|
| `api.test.ts` | API client — endpoint'ler, hata durumları |
| `BlogList.test.tsx` | Render, linkler, sayfalama, locale |

---

## Ortam Değişkenleri

`.env.example` dosyasını kopyalayarak `.env` oluşturun:

```bash
cp .env.example .env
```

| Değişken | Açıklama | Varsayılan |
|----------|----------|-----------|
| `POSTGRES_PASSWORD` | PostgreSQL şifresi | — (zorunlu) |
| `REDIS_PASSWORD` | Redis şifresi | — (zorunlu) |
| `JWT_SECRET` | JWT imzalama anahtarı (min 32 karakter) | — (zorunlu) |
| `JWT_EXPIRATION_MS` | Token süresi (ms) | `86400000` (24 saat) |
| `APP_ADMIN_EMAIL` | Varsayılan admin e-postası | `admin@krontech.com` |
| `APP_ADMIN_PASSWORD` | Varsayılan admin şifresi | — (zorunlu) |
| `APP_COOKIE_SECURE` | HTTPS cookie (prod: true) | `false` |
| `NEXT_PUBLIC_API_URL` | Frontend → Backend URL | `http://localhost:8080/api/v1` |
| `REVALIDATE_SECRET` | ISR revalidation secret | — (zorunlu) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 site key | — |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v2 secret key | — |

---

## Geliştirme Notları

### Veritabanı

`ddl-auto: update` ile schema otomatik güncellenir. İlk başlatmada `DataInitializer` örnek içerik oluşturur:
- 11 ürün (PAM Kron + alt modüller, Data Security, Network Security, DAM, AAA)
- 12 blog yazısı (TR/EN çevirili)
- 2 form tanımı (contact, demo-request)
- 5 resource (datasheet)

### Hot Reload

Frontend container'da kaynak dosyalar volume mount ile bağlıdır. `WATCHPACK_POLLING=true` ile Windows'ta da değişiklikler algılanır.

### Ortam Profilleri

- `application.yml` — production varsayılanları
- `application-test.yml` — test profili (Testcontainers ile kullanılır, cache devre dışı)

### AI Kullanımı

Bu proje boyunca Claude (Anthropic) aktif olarak kullanıldı:
- Entity modeli ve ilişkilerin tasarımı
- Spring Security + JWT implementasyonu
- Next.js App Router çok dilli routing yapısı
- Testcontainers integration test kurulumu
- TipTap editör entegrasyonu
- SEO/GEO metadata yapısı

AI çıktıları doğrudan kopyalanmadı; her çıktı proje gereksinimlerine göre değerlendirildi, uyarlandı ve test edildi.