'use client';

import { useEffect, useRef } from 'react';
import styles from './blog.module.css';

export default function StickyWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.innerWidth <= 768) return;

    const TOP_SPACING = 120;

    const onScroll = () => {
      // layout container = sideCol'un parent'ı (flex row)
      const layoutContainer = el.parentElement?.parentElement;
      if (!layoutContainer) return;

      const containerBottom = layoutContainer.getBoundingClientRect().bottom;
      const elHeight = el.offsetHeight;

      if (containerBottom - elHeight < TOP_SPACING) {
        // Container'ın altına yaklaştık, sidebar yukarı kaymaya başlar
        const newTop = Math.max(0, containerBottom - elHeight);
        el.style.top = `${newTop}px`;
      } else {
        el.style.top = `${TOP_SPACING}px`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className={styles.stickyWrapper}>
      {children}
    </div>
  );
}
