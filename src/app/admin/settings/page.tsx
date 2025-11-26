'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    contactEmail: '',
    contactPhone: '',
    instagramUrl: '',
    youtubeUrl: '',
    videoUrl1: '',
    videoUrl2: '',
    videoUrl3: '',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Settings saved successfully!');
      router.refresh();
    } else {
      alert('Failed to save settings.');
    }
    setSaving(false);
  };

  if (status === 'loading' || loading) return <div className="container" style={{ paddingTop: '120px' }}>Loading...</div>;
  if (status === 'unauthenticated') return null; // Redirecting

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 className="section-title">Site Settings</h1>
      
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        
        {/* Hero Section */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Hero Section</h3>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hero Title</label>
          <input type="text" name="heroTitle" value={formData.heroTitle || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hero Subtitle</label>
          <textarea name="heroSubtitle" value={formData.heroSubtitle || ''} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Background Image URL</label>
          <input type="text" name="heroImageUrl" value={formData.heroImageUrl || ''} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Paste a direct link to an image (e.g., from Unsplash or Cloudinary).</p>
        </div>

        {/* Videos */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Featured Videos</h3>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 1 (Embed URL)</label>
          <input type="text" name="videoUrl1" value={formData.videoUrl1 || ''} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 2 (Embed URL)</label>
          <input type="text" name="videoUrl2" value={formData.videoUrl2 || ''} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 3 (Embed URL)</label>
          <input type="text" name="videoUrl3" value={formData.videoUrl3 || ''} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        {/* Contact */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Contact & Social</h3>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Instagram URL</label>
          <input type="text" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        <button type="submit" className="cta-button" disabled={saving} style={{ width: '100%', border: 'none', cursor: saving ? 'wait' : 'pointer', marginTop: '20px' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
