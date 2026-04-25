# Krontech Web — Redesign Project

A full-stack redesign of the Krontech Technologies corporate website, built with Spring Boot 4 and Next.js 16.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4, Java 21, Spring Security, JPA/Hibernate |
| Frontend | Next.js 16, TypeScript, TailwindCSS |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT + HttpOnly Cookie |
| Container | Docker, Docker Compose |

## Quick Start

### Requirements

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/krontech-web-project.git
cd krontech-web-project

# 2. Configure environment variables
cp .env.example .env
# Edit .env — at minimum change the passwords

# 3. Start all services
docker compose up --build
```

Once all services are ready:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api/v1
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Admin Panel:** http://localhost:3000/admin

### Admin Login

Use the `APP_ADMIN_EMAIL` and `APP_ADMIN_PASSWORD` values from your `.env` file.

Default:
```
Email:    admin@krontech.com
Password: (set in .env file)
```

### Stop Services

```bash
# Stop services
docker compose down

# Stop services and reset database
docker compose down -v
```

## Project Structure

```
krontech-web-project/
├── docker-compose.yml        # All services
├── .env.example              # Environment variable template
├── backend/                  # Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/krontech/backend/
│           │   ├── controller/     # REST endpoints
│           │   ├── service/        # Business logic
│           │   ├── entity/         # JPA entities
│           │   ├── dto/            # Request/Response DTOs
│           │   ├── repository/     # Spring Data repositories
│           │   ├── security/       # JWT, auth filter
│           │   └── config/         # Spring configuration
│           └── resources/
│               └── application.yml
└── frontend/                 # Next.js application
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/
        │   ├── [locale]/         # Public site (TR/EN)
        │   └── admin/            # CMS admin panel
        ├── components/
        │   └── admin/            # Admin components
        └── lib/
            ├── api.ts            # Public API client
            └── admin-api.ts      # Admin API client
```

## Features

### Public Site
- Multilingual content (TR/EN)
- Product catalog with detail pages (Solution, How It Works, Key Benefits, Product Family, Resources tabs)
- Blog list and detail pages
- SEO optimization (JSON-LD, hreflang, meta tags)

### Admin Panel (CMS)
- Secure auth with HttpOnly cookie
- Blog post creation and editing (TipTap WYSIWYG editor)
- Product content management (tabbed editing)
- Resource management (datasheets, whitepapers)
- Multilingual support (TR/EN)

## API Documentation

Swagger UI: http://localhost:8080/swagger-ui.html

---

# Krontech Web — Yeniden Geliştirme Projesi

Krontech Technologies kurumsal web sitesinin Spring Boot 4 + Next.js 16 ile yeniden geliştirilmesi.

## Kurulum

### Gereksinimler

- Docker Desktop (Windows/Mac) veya Docker Engine + Docker Compose (Linux)
- Git

### Hızlı Başlangıç

```bash
# 1. Repoyu klonla
git clone https://github.com/your-username/krontech-web-project.git
cd krontech-web-project

# 2. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle — en azından şifreleri değiştir

# 3. Tüm servisleri başlat
docker compose up --build
```

Servisler hazır olduğunda:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api/v1
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Admin Panel:** http://localhost:3000/admin

### Admin Girişi

`.env` dosyasındaki `APP_ADMIN_EMAIL` ve `APP_ADMIN_PASSWORD` değerleriyle giriş yapılır.

Varsayılan:
```
Email:    admin@krontech.com
Password: (env dosyasında belirlenen)
```

### Servisleri Durdurma

```bash
# Servisleri durdur
docker compose down

# Servisleri durdur ve veritabanını sıfırla
docker compose down -v
```

## Proje Yapısı

```
krontech-web-project/
├── docker-compose.yml        # Tüm servisler
├── .env.example              # Ortam değişkeni şablonu
├── README.md
├── backend/                  # Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
└── frontend/                 # Next.js uygulaması
    ├── Dockerfile
    ├── package.json
    └── src/
```

## Özellikler

### Public Site
- Çok dilli içerik (TR/EN)
- Ürün kataloğu ve detay sayfaları (Solution, How It Works, Key Benefits, Product Family, Resources sekmeleri)
- Blog listesi ve detay sayfaları
- SEO optimizasyonu (JSON-LD, hreflang, meta tags)

### Admin Panel (CMS)
- HttpOnly cookie tabanlı güvenli auth
- Blog yazısı oluşturma/düzenleme (TipTap WYSIWYG editör)
- Ürün içeriği yönetimi (sekmeli düzenleme)
- Kaynak (datasheet/whitepaper) yönetimi
- Çok dil desteği (TR/EN)

## API Dokümantasyonu

Swagger UI: http://localhost:8080/swagger-ui.html

## Geliştirme Notları

### Veritabanı
`ddl-auto: update` yapılandırması ile schema otomatik güncellenir. İlk başlatmada `DataInitializer` örnek içerik oluşturur.

### Hot Reload
Frontend container'da kaynak dosyalar volume mount ile bağlıdır — kod değişikliklerinde otomatik yenilenir.

### Ortam Profilleri
- `application.yml` — production varsayılanları
- `application-dev.yml` — geliştirme overrides (`cookie.secure=false`)