'use client';

import { useState } from 'react';

interface Testimonial {
  image: string;
  logo: string;
  title: string;
  quote: string;
  author: string;
  videoUrl: string;
}

export default function ProductTestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);

  if (!testimonials.length) return null;

  const slide = testimonials[current];
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1563ff 0%, #0d3fa6 100%)',
      padding: '60px 0',
      marginTop: '48px',
      // contentInner'dan (max-width:1280px, padding:0 24px) taşır
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Tırnak dekorasyon */}
      <div style={{
        position: 'absolute', right: '6%', top: '5%',
        fontSize: '220px', color: 'rgba(255,255,255,0.07)',
        fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        "
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 80px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

          {/* Sol ok */}
          <button onClick={prev} aria-label="Previous" style={{
            flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.5)', background: 'transparent',
            color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slide içeriği */}
          <div style={{ flex: 1, display: 'flex', gap: '48px', alignItems: 'center' }}>
            {/* Görsel */}
            <div style={{ flex: '0 0 46%', position: 'relative' }}>
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
              />
              <a
                href={slide.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  transition: 'transform 0.15s',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1563ff">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Metin */}
            <div style={{ flex: 1, paddingRight: '16px' }}>
              <img
                src={slide.logo}
                alt="Logo"
                style={{ height: '52px', objectFit: 'contain', marginBottom: '20px', display: 'block' }}
              />
              <h3 style={{
                fontSize: '20px', fontWeight: 700, color: 'white',
                margin: '0 0 16px', lineHeight: 1.45,
              }}>
                {slide.title}
              </h3>
              <p style={{
                fontSize: '14px', color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.75, margin: '0 0 20px',
              }}>
                {slide.quote}
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                {slide.author}
              </p>
            </div>
          </div>

          {/* Sağ ok */}
          <button onClick={next} aria-label="Next" style={{
            flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.5)', background: 'transparent',
            color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.25s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
