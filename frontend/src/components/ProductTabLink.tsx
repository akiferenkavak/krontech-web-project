'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './product.module.css';

interface TabLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function ProductTabLink({ href, label, icon }: TabLinkProps) {
  const pathname = usePathname();

  // solution sekmesi: exact match
  // diğerleri: pathname href ile bitiyor mu?
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`${styles.tabLink} ${isActive ? styles.tabLinkActive : ''}`}
    >
      {icon}
      {label}
    </Link>
  );
}
