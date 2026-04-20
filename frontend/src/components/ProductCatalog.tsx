'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { type Locale } from '@/i18n/config';
import { type ProductSummary } from '@/lib/api';

const BASE = 'https://krontech.com';
const productImages: Record<string, string> = {
  'pam-kron':         `${BASE}/_upload/listcontentimages/PAM_gartner_.jpg`,
  'data-security':    `${BASE}/_upload/listcontentimages/kron_ddm_product_.png`,
  'network-security': `${BASE}/_upload/listcontentimages/aaa-product.png`,
  'dam':              `${BASE}/_upload/listcontentimages/kron_dam_product_.png`,
  'aaa-solution':     `${BASE}/_upload/listcontentimages/aaa-product.png`,
};
const fallbackImage = `${BASE}/_upload/listcontentimages/PAM_gartner_.jpg`;

const CARD_WIDTH = 362;
const GAP = 30;
const STEP = CARD_WIDTH + GAP;
const TRACK_OFFSET = -STEP;

type Props = { locale: Locale; products: ProductSummary[] };

export default function ProductCatalog({ products, locale }: Props) {
  const n = products.length;
  const [centerIdx, setCenterIdx] = useState(0);
  const [trackX, setTrackX] = useState(TRACK_OFFSET);
  // 'idle' | 'sliding' | 'resetting'
  const [phase, setPhase] = useState<'idle' | 'sliding' | 'resetting'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const pendingDir = useRef<1 | -1>(1);

  if (!n) return null;
  const mod = (i: number) => ((i % n) + n) % n;

  const goTo = (dir: 1 | -1) => {
    if (phase !== 'idle') return;
    pendingDir.current = dir;
    setPhase('sliding');
    setTrackX(TRACK_OFFSET + dir * -STEP);

    setTimeout(() => {
      // Phase = resetting: track transition kapalı, index güncelleniyor
      setPhase('resetting');
      setCenterIdx(prev => mod(prev + dir));
      setTrackX(TRACK_OFFSET);

      // Bir sonraki frame'de idle'a dön
      requestAnimationFrame(() => {
        setPhase('idle');
      });
    }, 410);
  };

  const startDrag = (clientX: number) => {
    if (phase !== 'idle') return;
    dragStartX.current = clientX;
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (!isDragging) return;
    setTrackX(TRACK_OFFSET + (clientX - dragStartX.current));
  };

  const endDrag = (clientX: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 80) {
      goTo(delta < 0 ? 1 : -1);
    } else {
      setTrackX(TRACK_OFFSET);
    }
  };

  // Track transition:
  // - sliding: açık (animasyon çalışsın)
  // - resetting: KAPALI (sıfırlama görünmesin)
  // - idle: açık (drag snap için)
  // - dragging: kapalı (parmak takip etsin)
  const trackTransition = isDragging
    ? 'none'
    : phase === 'resetting'
      ? 'none'
      : 'transform 0.4s ease';

  const positions = [-2, -1, 0, 1, 2];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-medium text-gray-900 mb-2">
            {locale === 'tr' ? 'Kron Ürünleri' : 'Kron Products'}
          </h2>
          <p className="text-gray-500 text-sm">
            {locale === 'tr'
              ? "Kron'un öncü teknoloji ve siber güvenlik yazılım ürünleri"
              : "Kron's cutting edge technology and cyber security software products"}
          </p>
        </div>

        <div className="relative flex items-center justify-center select-none">

          <button
            onClick={() => goTo(-1)}
            disabled={phase !== 'idle'}
            className="absolute z-20 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-40"
            style={{ left: 'calc(50% - 620px)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            style={{
              width: `${CARD_WIDTH * 3 + GAP * 2}px`,
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => startDrag(e.clientX)}
            onMouseMove={(e) => moveDrag(e.clientX)}
            onMouseUp={(e) => endDrag(e.clientX)}
            onMouseLeave={(e) => { if (isDragging) endDrag(e.clientX); }}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
            onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
            onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: `${GAP}px`,
                transform: `translateX(${trackX}px)`,
                transition: trackTransition,
                willChange: 'transform',
              }}
            >
              {positions.map((pos) => {
                const idx = mod(centerIdx + pos);
                const product = products[idx];
                const imgSrc = productImages[product.slug] ?? fallbackImage;

                const offsetFromBase = trackX - TRACK_OFFSET;
                const distFromCenter = pos + offsetFromBase / STEP;
                const absdist = Math.abs(distFromCenter);
                const centerWeight = Math.max(0, 1 - absdist);
                const yOffset = (1 - centerWeight) * 30;
                const shadowOpacity = centerWeight * 0.12;
                const shadowSize = centerWeight * 25;

                return (
                  <div
                    key={pos}
                    style={{
                      width: `${CARD_WIDTH}px`,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #cacaca',
                      background: 'white',
                      color: '#4d5154',
                      transform: `translateY(${yOffset}px)`,
                      boxShadow: shadowOpacity > 0.02
                        ? `0 ${10 * centerWeight}px ${shadowSize}px rgba(0,0,0,${shadowOpacity})`
                        : 'none',
                      // Kartlar HER ZAMAN transition'lı — sadece track açıp kapanıyor
                      transition: (isDragging || phase === 'resetting')
                        ? 'none'
                        : 'transform 0.4s ease, box-shadow 0.4s ease',
                      paddingTop: '40px',
                      paddingLeft: '32px',
                      paddingRight: '32px',
                    }}
                  >
                    <div style={{
                      marginTop: '-20px',
                      marginLeft: '-32px',
                      marginRight: '-32px',
                      height: '200px',
                      position: 'relative',
                    }}>
                      <Image
                        src={imgSrc}
                        alt={product.title ?? product.slug}
                        fill
                        className="object-cover"
                        unoptimized
                        draggable={false}
                      />
                    </div>

                    <div style={{ paddingTop: '20px', flexGrow: 1 }}>
                      <h4 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          style={{ color: '#212529' }}
                          className="hover:text-blue-600 transition-colors"
                          draggable={false}
                          onClick={(e) => { if (Math.abs(trackX - TRACK_OFFSET) > 5) e.preventDefault(); }}
                        >
                          {product.title ?? product.slug}
                        </Link>
                      </h4>
                      <p style={{ fontSize: '14px', color: '#4d5154', lineHeight: '1.6' }}>
                        {product.shortDescription}
                      </p>
                    </div>

                    <div style={{
                      borderTop: '2px solid #d6d6d6',
                      marginLeft: '-32px',
                      marginRight: '-32px',
                      marginTop: '24px',
                    }}>
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="block text-center hover:text-blue-600 transition-colors"
                        style={{
                          fontSize: '18px',
                          fontWeight: 500,
                          color: '#212529',
                          paddingTop: '24px',
                          paddingBottom: '24px',
                        }}
                        draggable={false}
                        onClick={(e) => { if (Math.abs(trackX - TRACK_OFFSET) > 5) e.preventDefault(); }}
                      >
                        {locale === 'tr' ? 'Detaylı Bilgi' : 'Learn More'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => goTo(1)}
            disabled={phase !== 'idle'}
            className="absolute z-20 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-40"
            style={{ right: 'calc(50% - 620px)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}