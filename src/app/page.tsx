import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroCarousel from '@/components/HeroCarousel';
import InstagramEmbed from '@/components/InstagramEmbed';

export const revalidate = 0; // Dynamic data

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
  });

  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { date: 'asc' },
    take: 3,
  });

  // Use new heroImages array if available, otherwise fall back to legacy fields
  let heroImages = settings?.heroImages || [];
  if (heroImages.length === 0) {
    heroImages = [
      settings?.heroImageUrl,
      settings?.heroImageUrl2,
      settings?.heroImageUrl3,
      settings?.heroImageUrl4,
    ].filter(Boolean) as string[];
  }

  const video1 = settings?.videoUrl1 || 'https://www.youtube.com/embed/videoseries?list=PLU12uITxBEPGsXqgC-Vd5XnK-WqXnK-Wq';
  const video2 = settings?.videoUrl2 || 'https://www.youtube.com/embed/videoseries?list=PLU12uITxBEPGsXqgC-Vd5XnK-WqXnK-Wq';
  const video3 = settings?.videoUrl3 || 'https://www.youtube.com/embed/videoseries?list=PLU12uITxBEPGsXqgC-Vd5XnK-WqXnK-Wq';

  return (
    <main>
      {/* Hero Section with Carousel */}
      <HeroCarousel 
        images={heroImages}
        title="" // Removed
        subtitle="" // Removed
      />

      {/* Upcoming Events Section */}
      <section id="events" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {events.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>No upcoming events at the moment. Stay tuned!</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '200px', background: '#f5f5f5', position: 'relative' }}>
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        <i className="fas fa-calendar-alt" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{event.title}</h3>
                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#888' }}>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i>
                        {event.location}
                      </span>
                      {event.link && (
                        <a href={event.link} target="_blank" style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem' }}>Details &rarr;</a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
             <Link href="/about" className="cta-button" style={{ background: 'transparent', border: '2px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                Read Our Story
             </Link>
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section id="videos" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="container">
          <h2 className="section-title">Latest Videos</h2>
          <div className="video-grid">
            {/* Video 1 */}
            <div className="video-card">
              <div className="video-thumbnail">
                <iframe width="100%" height="100%" src={video1} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="video-info">
                <h3>{settings?.videoTitle1 || 'Featured Video 1'}</h3>
                <p>Experience the divine bliss.</p>
              </div>
            </div>
            {/* Video 2 */}
            <div className="video-card">
              <div className="video-thumbnail">
                <iframe width="100%" height="100%" src={video2} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="video-info">
                <h3>{settings?.videoTitle2 || 'Featured Video 2'}</h3>
                <p>Divine darshan of Vrindavan.</p>
              </div>
            </div>
            {/* Video 3 */}
            <div className="video-card">
              <div className="video-thumbnail">
                <iframe width="100%" height="100%" src={video3} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="video-info">
                <h3>{settings?.videoTitle3 || 'Featured Video 3'}</h3>
                <p>Spiritual discourse and kirtan.</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="https://www.youtube.com/@vrindavanrasdesh" target="_blank" className="cta-button">Visit Channel for More</a>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section id="instagram">
        <div className="container">
          <h2 className="section-title">Daily Darshan (Instagram)</h2>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '2rem' }}>Follow our daily updates on Instagram.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {settings?.instagramPost1 && (
                <div style={{ width: '100%', maxWidth: '350px' }}>
                  <InstagramEmbed postUrl={settings.instagramPost1} />
                </div>
              )}
              {settings?.instagramPost2 && (
                <div style={{ width: '100%', maxWidth: '350px' }}>
                  <InstagramEmbed postUrl={settings.instagramPost2} />
                </div>
              )}
              {settings?.instagramPost3 && (
                <div style={{ width: '100%', maxWidth: '350px' }}>
                  <InstagramEmbed postUrl={settings.instagramPost3} />
                </div>
              )}
              {!settings?.instagramPost1 && !settings?.instagramPost2 && !settings?.instagramPost3 && (
                <p>No Instagram posts configured yet.</p>
              )}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <a href={settings?.instagramUrl || "https://www.instagram.com/"} target="_blank" className="cta-button" style={{ background: '#E1306C' }}>Follow on Instagram</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title">Connect With Us</h2>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '2rem' }}>For inquiries, collaborations, or to share your experiences, please reach out to us.</p>
            
            {settings?.contactEmail && <p style={{marginBottom: '10px'}}><strong>Email:</strong> {settings.contactEmail}</p>}
            {settings?.contactPhone && <p style={{marginBottom: '20px'}}><strong>Phone:</strong> {settings.contactPhone}</p>}

            <div className="social-links" style={{ marginBottom: '2rem' }}>
              <a href="https://www.youtube.com/@vrindavanrasdesh" target="_blank" style={{ color: 'var(--primary-color)', fontSize: '3rem', margin: '0 10px' }}><i className="fab fa-youtube"></i></a>
              {settings?.instagramUrl && <a href={settings.instagramUrl} target="_blank" style={{ color: 'var(--primary-color)', fontSize: '3rem', margin: '0 10px' }}><i className="fab fa-instagram"></i></a>}
              {settings?.facebookUrl && <a href={settings.facebookUrl} target="_blank" style={{ color: 'var(--primary-color)', fontSize: '3rem', margin: '0 10px' }}><i className="fab fa-facebook"></i></a>}
            </div>
            <p>Jai Shri Radhe! Jai Shri Krishna!</p>
          </div>
        </div>
      </section>
    </main>
  )
}
