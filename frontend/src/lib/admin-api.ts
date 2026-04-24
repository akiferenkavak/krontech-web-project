const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

// Cookie otomatik gönderilir — credentials: 'include' şart
const adminFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

// ── Auth ────────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  const res = await adminFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json(); // { email, role }
}

export async function adminLogout() {
  await adminFetch(`${API_BASE}/auth/logout`, { method: 'POST' });
}

export async function getMe() {
  const res = await adminFetch(`${API_BASE}/auth/me`);
  if (!res.ok) throw new Error('Unauthorized');
  return res.json(); // { email, role }
}

// ── Blog ────────────────────────────────────────────────────────────────────

export async function adminGetBlogPosts() {
  const res = await adminFetch(`${API_BASE}/admin/blog-posts`);
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function adminGetBlogPost(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/blog-posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch blog post');
  return res.json();
}

export async function adminCreateBlogPost(data: unknown) {
  const res = await adminFetch(`${API_BASE}/admin/blog-posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create blog post');
  return res.json();
}

export async function adminUpdateBlogPost(id: string, data: unknown) {
  const res = await adminFetch(`${API_BASE}/admin/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update blog post');
  return res.json();
}

export async function adminDeleteBlogPost(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/blog-posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete blog post');
}

export async function adminPublishBlogPost(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/blog-posts/${id}/publish`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to publish blog post');
  return res.json();
}

// ── Products ────────────────────────────────────────────────────────────────

export async function adminGetProducts() {
  const res = await adminFetch(`${API_BASE}/admin/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function adminGetProduct(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function adminUpdateProductTranslation(
  productId: string,
  translationId: string,
  data: unknown
) {
  const res = await adminFetch(
    `${API_BASE}/admin/products/${productId}/translations/${translationId}`,
    { method: 'PUT', body: JSON.stringify(data) }
  );
  if (!res.ok) throw new Error('Failed to update product translation');
  return res.json();
}

export async function adminPublishProduct(id: string) {
  const res = await adminFetch(`${API_BASE}/admin/products/${id}/publish`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to publish product');
  return res.json();
}

// ── Media ────────────────────────────────────────────────────────────────────

export async function adminUploadMedia(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/admin/media/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // Content-Type header'ı FormData için otomatik set edilmeli — elle koyma
  });
  if (!res.ok) throw new Error('Failed to upload media');
  return res.json(); // { id, url, filename, ... }
}

export async function adminGetMedia() {
  const res = await adminFetch(`${API_BASE}/admin/media`);
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}
