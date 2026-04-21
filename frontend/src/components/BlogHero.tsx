interface BlogHeroProps {
  bannerUrl: string;
  title: string;
}

export default function BlogHero({ bannerUrl, title }: BlogHeroProps) {
  return (
    <section style={{ marginBottom: 0 }}>
      <div
        style={{
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Koyu overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 300,
            color: 'white',
            margin: 0,
            letterSpacing: '1px',
          }}>
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
