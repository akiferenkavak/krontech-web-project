'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { type Locale } from '@/i18n/config';
import { type BlogPostSummary } from '@/lib/api';

const CARD_WIDTH = 332;
const GAP = 30;
const STEP = CARD_WIDTH + GAP;
const TRACK_OFFSET = -STEP;

type Props = { locale: Locale; posts: BlogPostSummary[] };

export default function BlogSlider({ posts, locale }: Props) {
  const n = posts.length;
  const [centerIdx, setCenterIdx] = useState(0);
  const [trackX, setTrackX] = useState(TRACK_OFFSET);
  const [phase, setPhase] = useState<'idle' | 'sliding' | 'resetting'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  if (!n) return null;
  const mod = (i: number) => ((i % n) + n) % n;

  const goTo = (dir: 1 | -1) => {
    if (phase !== 'idle') return;
    setPhase('sliding');
    setTrackX(TRACK_OFFSET + dir * -STEP);

    setTimeout(() => {
      setPhase('resetting');
      setCenterIdx(prev => mod(prev + dir));
      setTrackX(TRACK_OFFSET);
      requestAnimationFrame(() => setPhase('idle'));
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
          <h3 className="text-3xl font-bold text-gray-900">
            {locale === 'tr' ? 'Güncel Kalın' : 'Keep up to Date'}
          </h3>
        </div>

        <div className="relative flex items-center justify-center select-none">

          {/* Sol ok */}
          <button
            onClick={() => goTo(-1)}
            disabled={phase !== 'idle'}
            className="absolute z-20 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-40"
            style={{ left: 'calc(50% - 580px)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Pencere: 3 kart */}
          <div
            style={{ width: `${CARD_WIDTH * 3 + GAP * 2}px`, overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab' }}
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
                gap: `${GAP}px`,
                transform: `translateX(${trackX}px)`,
                transition: trackTransition,
                willChange: 'transform',
              }}
            >
              {positions.map((pos) => {
                const idx = mod(centerIdx + pos);
                const post = posts[idx];

                return (
                  <div
                    key={pos}
                    style={{ width: `${CARD_WIDTH}px`, flexShrink: 0 }}
                  >
                    {/* Görsel */}
                    <div className="relative w-full mb-3 overflow-hidden" style={{ height: '188px' }}>
                      {/* Badge */}
                      <span
                        className="absolute top-3 left-3 z-10 text-xs font-semibold text-white px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#2563eb' }}
                      >
                        Blog
                      </span>

                      {post.featuredImageUrl ? (
                        <Image
                          src={post.featuredImageUrl}
                          alt={post.title ?? ''}
                          fill
                          className="object-cover"
                          unoptimized
                          draggable={false}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)' }}
                        >
                          <span className="text-5xl font-black text-white opacity-10">
                            {post.title?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* İçerik */}
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-snug">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                        draggable={false}
                        onClick={(e) => { if (Math.abs(trackX - TRACK_OFFSET) > 5) e.preventDefault(); }}
                      >
                        {post.title}
                      </Link>
                    </h4>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              locale === 'tr' ? 'tr-TR' : 'en-US',
                              { month: 'short', day: 'numeric', year: 'numeric' }
                            )
                          : ''}
                      </span>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="text-xs text-blue-600 font-medium hover:underline"
                        draggable={false}
                        onClick={(e) => { if (Math.abs(trackX - TRACK_OFFSET) > 5) e.preventDefault(); }}
                      >
                        {locale === 'tr' ? 'Devamını Oku' : 'Read More'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sağ ok */}
          <button
            onClick={() => goTo(1)}
            disabled={phase !== 'idle'}
            className="absolute z-20 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-40"
            style={{ right: 'calc(50% - 580px)' }}
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