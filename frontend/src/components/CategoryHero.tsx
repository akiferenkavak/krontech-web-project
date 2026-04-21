interface CategoryHeroProps {
  bannerUrl: string;
  title: string;
}

export default function CategoryHero({ bannerUrl, title }: CategoryHeroProps) {
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
        }}
      >
        {/* Başlık görsel içinde invisible — orijinale sadık */}
        <h1 style={{ visibility: 'hidden', fontSize: '3rem', color: 'white' }}>
          {title}
        </h1>
      </div>
    </section>
  );
}
