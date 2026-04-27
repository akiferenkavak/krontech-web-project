// frontend/src/components/__tests__/BlogList.test.tsx

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogList from '@/components/BlogList';
import { type BlogPostSummary } from '@/lib/api';

const mockPosts: BlogPostSummary[] = [
  {
    id: 'post-1',
    slug: 'zero-trust-mimarisi',
    title: 'Zero Trust Architecture: Why It Matters',
    excerpt: 'Zero trust architecture overview.',
    featuredImageUrl: 'https://example.com/image.jpg',
    authorName: 'Admin',
    tags: [],
    publishedAt: '2025-01-15T10:00:00',
    featured: false,
  },
  {
    id: 'post-2',
    slug: 'pam-nedir',
    title: 'What is PAM?',
    excerpt: 'PAM introduction.',
    featuredImageUrl: null,
    authorName: 'Editor',
    tags: [],
    publishedAt: '2025-02-01T12:00:00',
    featured: true,
  },
];

describe('BlogList Component', () => {
  it('renders all post titles', () => {
    render(
      <BlogList
        locale="en"
        posts={mockPosts}
        currentPage={1}
        totalPages={1}
      />
    );

    expect(screen.getByText('Zero Trust Architecture: Why It Matters'))
      .toBeInTheDocument();
    expect(screen.getByText('What is PAM?')).toBeInTheDocument();
  });

  it('renders Read More links with correct hrefs', () => {
    render(
      <BlogList locale="en" posts={mockPosts} currentPage={1} totalPages={1} />
    );

    const readMoreLinks = screen.getAllByText(/read more/i);
    expect(readMoreLinks[0].closest('a')).toHaveAttribute(
      'href',
      '/en/blog/zero-trust-mimarisi'
    );
  });

  it('renders Devamını Oku for Turkish locale', () => {
    render(
      <BlogList locale="tr" posts={mockPosts} currentPage={1} totalPages={1} />
    );

    expect(screen.getAllByText(/devamını oku/i).length).toBeGreaterThan(0);
  });

  it('shows pagination when totalPages > 1', () => {
    render(
      <BlogList locale="en" posts={mockPosts} currentPage={1} totalPages={3} />
    );

    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument();
  });

  it('does not show pagination when totalPages = 1', () => {
    render(
      <BlogList locale="en" posts={mockPosts} currentPage={1} totalPages={1} />
    );

    expect(screen.queryByRole('link', { name: '2' })).not.toBeInTheDocument();
  });

  it('renders featured image when provided', () => {
    render(
      <BlogList locale="en" posts={mockPosts} currentPage={1} totalPages={1} />
    );

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders placeholder when featuredImageUrl is null', () => {
    render(
      <BlogList locale="en" posts={[mockPosts[1]]} currentPage={1} totalPages={1} />
    );

    // img yoksa placeholder div render edilmeli
    const images = screen.queryAllByRole('img');
    expect(images.length).toBe(0);
  });

  it('renders published date in English format', () => {
    render(
      <BlogList locale="en" posts={[mockPosts[0]]} currentPage={1} totalPages={1} />
    );

    expect(screen.getByText(/jan/i)).toBeInTheDocument();
  });
});