export interface CategoryMeta {
  slug: string;
  categoryKey: string; // backend'deki category field değeri
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  bannerUrl: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: 'identity-access',
    categoryKey: 'identity-access',
    title: {
      tr: 'Kimlik ve Erişim Yönetimi',
      en: 'Identity & Access Management',
    },
    description: {
      tr: 'Siber güvenlik günümüz dünyasında kritik ve kaçınılmazdır.\nKron\'un Kimlik ve Erişim Yönetimi çözümleriyle kimlik bilgilerinizi yönetin.',
      en: "Cyber security is crucial and inevitable in today's world.\nManage your credentials with Kron's Identity & Access Management solutions.",
    },
    bannerUrl: 'https://krontech.com/_upload/bannerimages/bebff10c3aec7dd5a0654e7c77db8e9e-5f4e4bdb7bf6d.jpg',
  },
  {
    slug: 'data',
    categoryKey: 'data',
    title: {
      tr: 'Veri Güvenliği ve Veri Yönetimi',
      en: 'Data Security & Data Management',
    },
    description: {
      tr: 'Hassas verilerinizi maskeleyen ve ağ trafiğinin sıfır kayıplı kaydını sağlayan gelişmiş çözümlerle veri sızıntısı riskini ortadan kaldırın.',
      en: 'Eliminate the risk of data leaks with the advanced solutions that mask your sensitive data and provide zero-loss logging of network traffic.',
    },
    bannerUrl: 'https://krontech.com/_upload/bannerimages/bebff10c3aec7dd5a0654e7c77db8e9e-5f4e4bdb7bf6d.jpg',
  },
  {
    slug: 'network',
    categoryKey: 'network',
    title: {
      tr: 'Telko Çözümleri',
      en: 'Telco Solutions',
    },
    description: {
      tr: 'Kurumunuzun BT altyapısını çığır açan teknolojilerle destekleyin ve başarılı bir dijital dönüşümün kapılarını bugün açın.',
      en: "Support your organization's IT infrastructure with groundbreaking technologies and open the door to a successful digital transformation today.",
    },
    bannerUrl: 'https://krontech.com/_upload/bannerimages/bebff10c3aec7dd5a0654e7c77db8e9e-5f4e4bdb7bf6d.jpg',
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

// Ürün slug'ına göre CDN görsel URL'si
export const productImages: Record<string, string> = {
  'pam-kron':                      'https://krontech.com/_upload/listcontentimages/a3f8b7de48fd069d47287156718766b9-5efc9286cc057.png',
  'password-vault':                'https://krontech.com/_upload/listcontentimages/cc7e6cc842608c6c700bd74ed683d532-5f0d5b4f69ac7.jpg',
  'privileged-session-manager':    'https://krontech.com/_upload/listcontentimages/f923ff37dd73a88bc20c74c1ccb4faf1-5f0d5a7266bd6_1.jpg',
  'multi-factor-authentication':   'https://krontech.com/_upload/listcontentimages/350x170-Multi-Factor-Authentication.jpg',
  'endpoint-privileged-management':'https://krontech.com/_upload/listcontentimages/350x170-endpoint-privileged-management.jpg',
  'user-behavior-analytics':       'https://krontech.com/_upload/listcontentimages/350x170-USER-BEHAVIOUR-ANALYTICS.jpg',
  'unified-access-manager':        'https://krontech.com/_upload/listcontentimages/b844f50b4676eea5b1728b4ffb8b158d-5f0d5c4b737b7.jpg',
  'data-security':                 'https://krontech.com/_upload/listcontentimages/350x170-dynamic-data-masking.jpg',
  'dam':                           'https://krontech.com/_upload/listcontentimages/15a13b5ecab89426c7e3c3a794d01414-5f0d5bbfa3a81.jpg',
  'network-security':              'https://krontech.com/_upload/listcontentimages/b844f50b4676eea5b1728b4ffb8b158d-5f0d5c4b737b7.jpg',
  'aaa-solution':                  'https://krontech.com/_upload/listcontentimages/350x170-AAA.jpg',
};

export const fallbackImage = 'https://krontech.com/_upload/listcontentimages/a3f8b7de48fd069d47287156718766b9-5efc9286cc057.png';
