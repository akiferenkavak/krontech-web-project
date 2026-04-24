import { type Locale } from '@/i18n/config';
import { getProductBySlug } from '@/lib/api';
import styles from '@/components/product.module.css';
import TestimonialSlider from '@/components/ProductTestimonialSlider';

const pamTestimonials = [
  {
    image: 'https://krontech.com/_upload/descriptioncontentimages/kron-anadolu-efes-735x500px.jpg',
    logo: 'https://krontech.com/_upload/descriptionlogos/Anadolu_Efes_logo__90x65px.png',
    title: "Anadolu Efes Ensures Data and Access Security with Kron's Cybersecurity Solutions",
    quote: "With Kron PAM, system and application experts started managing their authorized servers more easily and with visually enriched screens. This has led to increased convenience, speed, and motivation.",
    author: 'Mehmet Temiz - Information Security Manager',
    videoUrl: 'https://youtu.be/Ag2dQLxBzdE',
  },
  {
    image: 'https://krontech.com/_upload/descriptioncontentimages/41cd730f55d5f621ee00851a4eae05d2-5f4f74707e4b2.jpg',
    logo: 'https://krontech.com/_upload/descriptionlogos/0ab0430e8c48dba8b5e644d48008212c-5f4f70e782671.png',
    title: 'Turkcell Secures Hundreds of Thousands of Devices and Privileged Accounts with Kron PAM',
    quote: "The most significant advantage Kron PAM provided us was the management of privileged accounts accessing a large number of devices, as well as the use and recording of passwords in all of them, without sharing passwords with anyone else.",
    author: 'Alper Eryılmaz - Identity Access Management Associate Director',
    videoUrl: 'https://youtu.be/YrEasJljE-A',
  },
];

const pamSuccessStory = {
  image: 'https://krontech.com/_upload/descriptioncontentimages/kron_sekerbank_967x644_1.jpg',
  title: 'How Sekerbank Assures Data and Access Security?',
  desc: "Sekerbank, one of Turkey's leading banks with a long history, secures and manages privileged account password information with Kron PAM in order to maximize data and access security.",
  videoUrl: 'https://youtu.be/wnBRv_CVAQQ',
};

export default async function ProductSolutionPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';
  const isPam = slug === 'pam-kron';

  let product = null;
  try {
    product = await getProductBySlug(slug, locale);
  } catch {
    return (
      <p style={{ color: '#9ca3af', padding: '40px 0' }}>
        {isTr ? 'Ürün bulunamadı.' : 'Product not found.'}
      </p>
    );
  }

  const translation = product.translations?.find((t) => t.languageCode === locale);

  return (
    <div>
      {/* HTML içerik */}
      {translation?.content ? (
        <div
          className={styles.htmlContent}
          style={{ paddingTop: '32px' }}
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />
      ) : (
        <p style={{ color: '#9ca3af', padding: '40px 0' }}>
          {isTr ? 'Bu ürün için henüz içerik eklenmemiş.' : 'No content available yet.'}
        </p>
      )}

      {/* Testimonial slider — full width */}
      {isPam && <TestimonialSlider testimonials={pamTestimonials} />}

      {/* Şekerbank success story — full width */}
      {isPam && (
        <section style={{
          backgroundColor: 'white',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          width: '100vw',
          marginTop: '0',
        }}>
          <div style={{
            display: 'flex',
            minHeight: '420px',
          }}>
            {/* Sol — görsel + play */}
            <div style={{ flex: '0 0 50%', position: 'relative', overflow: 'hidden' }}>
              <img
                src={pamSuccessStory.image}
                alt="Sekerbank"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '420px' }}
              />
              <a
                href={pamSuccessStory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2563eb">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Sağ — metin */}
            <div style={{
              flex: 1,
              padding: '60px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}>
              <h3 style={{
                fontSize: '26px', fontWeight: 700, color: '#111827',
                margin: '0 0 20px', lineHeight: 1.4,
              }}>
                {pamSuccessStory.title}
              </h3>
              <p style={{
                fontSize: '14px', color: '#6b7280', lineHeight: 1.75,
                margin: '0 0 32px',
              }}>
                {pamSuccessStory.desc}
              </p>
              <a
                href={pamSuccessStory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignSelf: 'flex-start',
                  padding: '11px 28px',
                  border: '1px solid #2563eb',
                  color: '#2563eb',
                  fontSize: '14px', fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {isTr ? 'Müşteri Hikayesini İzle' : 'Watch the Customer Story'}
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
