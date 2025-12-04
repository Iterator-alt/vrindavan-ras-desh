import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Dynamic data

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
  });

  const heroBg = settings?.heroImageUrl || 'https://images.unsplash.com/photo-1561583669-7c875954d72d?q=80&w=1920&auto=format&fit=crop';
  const video1 = settings?.videoUrl1 || 'https://www.youtube.com/embed/videoseries?list=PLU12uITxBEPGsXqgC-Vd5XnK-WqXnK-Wq';
  const video2 = settings?.videoUrl2 || 'https://www.youtube.com/embed/videoseries?list=PLU12uITxBEPGsXqgC-Vd5XnK-WqXnK-Wq';
  const video3 = settings?.videoUrl3 || 'https://www.youtube.com/embed/videoseries?list=PLU12uITxBEPGsXqgC-Vd5XnK-WqXnK-Wq';

  return (
    <main>
      {/* Hero Section */}
      <header id="home" className="hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${heroBg}')` }}>
        <div className="container hero-content">
          <h1>{settings?.heroTitle || 'Welcome to Vrindavan Ras Desh'}</h1>
          <p>{settings?.heroSubtitle || 'Immerse yourself in the eternal divine love and spiritual bliss of Shri Vrindavan Dham.'}</p>
          <Link href="#videos" className="cta-button">Watch Videos</Link>
        </div>
      </header>

      {/* About Section */}
      <section id="about">
        <div className="container">
          <h2 className="section-title">About Our Channel</h2>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              "Vrindavan Ras Desh" is dedicated to sharing the divine essence (Ras) of Vrindavan. 
              Our content focuses on the spiritual heritage, daily pastimes (Leelas), and the devotional atmosphere 
              that makes Vrindavan the holiest of holy places.
            </p>
            <p>
              Join us on a journey of devotion, sankirtan, and darshan of the sacred temples and groves of Vraja.
            </p>
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
                <h3>Featured Video 1</h3>
                <p>Experience the divine bliss.</p>
              </div>
            </div>
            {/* Video 2 */}
            <div className="video-card">
              <div className="video-thumbnail">
                <iframe width="100%" height="100%" src={video2} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="video-info">
                <h3>Featured Video 2</h3>
                <p>Divine darshan of Vrindavan.</p>
              </div>
            </div>
            {/* Video 3 */}
            <div className="video-card">
              <div className="video-thumbnail">
                <iframe width="100%" height="100%" src={video3} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="video-info">
                <h3>Featured Video 3</h3>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {settings?.instagramPost1 && (
                <div style={{ width: '300px', height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                  <a href={settings.instagramPost1} target="_blank" style={{ color: '#E1306C', textDecoration: 'none' }}>View Post 1</a>
                </div>
              )}
              {settings?.instagramPost2 && (
                <div style={{ width: '300px', height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                  <a href={settings.instagramPost2} target="_blank" style={{ color: '#E1306C', textDecoration: 'none' }}>View Post 2</a>
                </div>
              )}
              {settings?.instagramPost3 && (
                <div style={{ width: '300px', height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                  <a href={settings.instagramPost3} target="_blank" style={{ color: '#E1306C', textDecoration: 'none' }}>View Post 3</a>
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
