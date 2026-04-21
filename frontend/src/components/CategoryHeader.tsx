interface CategoryHeaderProps {
  title: string;
  description: string;
}

export default function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <section style={{ padding: '48px 0 32px', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
          {description}
        </p>
      </div>
    </section>
  );
}
