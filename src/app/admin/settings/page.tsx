// Admin Settings Page - Updated 2025-12-04
// All Instagram post fields and contact details are present
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { extractYouTubeId } from '@/lib/utils';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeField, setActiveField] = useState('heroImageUrl');
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    heroImageUrl2: '',
    heroImageUrl3: '',
    heroImageUrl4: '',
    contactEmail: '',
    contactPhone: '',
    instagramUrl: '',
    youtubeUrl: '',
    videoUrl1: '',
    videoUrl2: '',
    videoUrl3: '',
    instagramPost1: '',
    instagramPost2: '',
    instagramPost3: '',
    facebookUrl: '',
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
    
    // Auto-convert YouTube links
    if (name.startsWith('videoUrl') && value) {
      const embedUrl = extractYouTubeId(value);
      if (embedUrl) {
        setFormData(prev => ({ ...prev, [name]: embedUrl }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        },
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const newBlob = await response.json();
      setFormData(prev => ({ ...prev, [activeField]: newBlob.url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
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
        {/* Hero Images */}
        {[
          { key: 'heroImageUrl', label: 'Hero Image 1 (Main)' },
          { key: 'heroImageUrl2', label: 'Hero Image 2' },
          { key: 'heroImageUrl3', label: 'Hero Image 3' },
          { key: 'heroImageUrl4', label: 'Hero Image 4' },
        ].map((imgField) => (
          <div key={imgField.key} className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{imgField.label}</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input 
                type="text" 
                name={imgField.key} 
                value={(formData as any)[imgField.key] || ''} 
                onChange={handleChange} 
                placeholder="https://..." 
                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
              />
              <button 
                type="button" 
                onClick={() => {
                  setActiveField(imgField.key);
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
                style={{ 
                  padding: '10px 20px', 
                  background: '#eee', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px',
                  cursor: uploading ? 'wait' : 'pointer'
                }}
              >
                {uploading && activeField === imgField.key ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {(formData as any)[imgField.key] && (
              <div style={{ marginTop: '10px', width: '100%', height: '200px', overflow: 'hidden', borderRadius: '5px', border: '1px solid #ddd' }}>
                <img src={(formData as any)[imgField.key]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        ))}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Paste a direct link or upload an image.</p>

        {/* Videos */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Featured Videos</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Paste any YouTube link (e.g., https://www.youtube.com/watch?v=...) and it will be automatically converted.</p>
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 1</label>
          <input type="text" name="videoUrl1" value={formData.videoUrl1 || ''} onChange={handleChange} placeholder="Paste YouTube Link" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 2</label>
          <input type="text" name="videoUrl2" value={formData.videoUrl2 || ''} onChange={handleChange} placeholder="Paste YouTube Link" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 3</label>
          <input type="text" name="videoUrl3" value={formData.videoUrl3 || ''} onChange={handleChange} placeholder="Paste YouTube Link" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        {/* Instagram Posts */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Instagram Posts</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Paste the full Instagram Post URL (e.g., https://www.instagram.com/p/Code...).</p>
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Instagram Post 1 URL</label>
          <input type="text" name="instagramPost1" value={formData.instagramPost1 || ''} onChange={handleChange} placeholder="https://www.instagram.com/p/..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Instagram Post 2 URL</label>
          <input type="text" name="instagramPost2" value={formData.instagramPost2 || ''} onChange={handleChange} placeholder="https://www.instagram.com/p/..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Instagram Post 3 URL</label>
          <input type="text" name="instagramPost3" value={formData.instagramPost3 || ''} onChange={handleChange} placeholder="https://www.instagram.com/p/..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        {/* Contact */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Contact & Social</h3>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Email</label>
          <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Phone</label>
          <input type="text" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Instagram Profile URL</label>
          <input type="text" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Facebook Profile URL</label>
          <input type="text" name="facebookUrl" value={formData.facebookUrl || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        <button type="submit" className="cta-button" disabled={saving} style={{ width: '100%', border: 'none', cursor: saving ? 'wait' : 'pointer', marginTop: '20px' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
