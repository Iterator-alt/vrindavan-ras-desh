import { prisma } from '@/lib/prisma';
import HeroCarousel from '@/components/HeroCarousel';

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
  });

  const aboutImages = settings?.aboutImages || [];

  return (
    <main>
      {/* Hero Section */}
      <HeroCarousel 
        images={aboutImages.length > 0 ? aboutImages : ['https://images.unsplash.com/photo-1561583669-7c875954d72d?q=80&w=1920&auto=format&fit=crop']}
        title="About Vrindavan Ras Desh"
        subtitle="Discover the divine essence of Vraja"
        ctaText="Explore More"
        ctaLink="#story"
      />

      <div className="container" id="story" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">Our Story</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', color: '#444' }}>
            Vrindavan Ras Desh was born from a deep desire to share the eternal bliss and spiritual vibrancy of Shri Vrindavan Dham with the world. 
            We believe that the divine love (Ras) of Radha and Krishna is not just a mythological concept but a living, breathing reality that can be experienced by anyone with a devoted heart.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', color: '#444' }}>
            Through our videos, articles, and community events, we aim to transport you to the sacred groves of Vraja, where every grain of sand is transcendent and every sound is a song of the Divine.
          </p>
          
          <h3 style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Our Mission</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>
            To preserve and propagate the authentic spiritual culture of Vrindavan, making it accessible to seekers everywhere, and to build a global community of devotees united by love and service.
          </p>
        </div>
      </div>
    </main>
  );
}
