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
    heroImages: [] as string[],
    contactEmail: '',
    contactPhone: '',
    instagramUrl: '',
    youtubeUrl: '',
    videoUrl1: '',
    videoTitle1: '',
    videoUrl2: '',
    videoTitle2: '',
    videoUrl3: '',
    videoTitle3: '',
    instagramPost1: '',
    instagramPost2: '',
    instagramPost3: '',
    facebookUrl: '',
    paymentQRCode: '',
    upiId: '',
    paymentInstructions: '',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        // Migration logic: If heroImages is empty but legacy fields exist, populate it
        let images = data.heroImages || [];
        if (images.length === 0) {
          if (data.heroImageUrl) images.push(data.heroImageUrl);
          if (data.heroImageUrl2) images.push(data.heroImageUrl2);
          if (data.heroImageUrl3) images.push(data.heroImageUrl3);
          if (data.heroImageUrl4) images.push(data.heroImageUrl4);
        }
        setFormData(prev => ({ ...prev, ...data, heroImages: images }));
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

    const file = e.target.files[0];
    
    // Client-side validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    
    if (file.size > maxSize) {
      alert(`File size too large! Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      e.target.value = ''; // Reset input
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type! Allowed types: JPG, PNG, GIF, WebP, SVG. Your file type: ${file.type}`);
      e.target.value = ''; // Reset input
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const newBlob = await response.json();
      
      if (activeField === 'heroImages') {
        setFormData(prev => ({
          ...prev,
          heroImages: [...((prev as any).heroImages || []), newBlob.url]
        }));
      } else if (activeField === 'aboutImages') {
        setFormData(prev => ({
          ...prev,
          aboutImages: [...((prev as any).aboutImages || []), newBlob.url]
        }));
      } else {
        setFormData(prev => ({ ...prev, [activeField]: newBlob.url }));
      }
      
      // Reset input
      e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload image: ${error.message || 'Please try again.'}`);
      e.target.value = ''; // Reset input
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
        {/* Hero Images */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
            Hero Images (Max 20)
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Existing Images */}
            {(formData as any).heroImages?.map((img: string, index: number) => (
              <div key={index} style={{ position: 'relative', aspectRatio: '16/9', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                <img src={img} alt={`Hero ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...(formData as any).heroImages];
                    newImages.splice(index, 1);
                    setFormData(prev => ({ ...prev, heroImages: newImages }));
                  }}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}
                >
                  ×
                </button>
                <div style={{ position: 'absolute', bottom: '5px', left: '5px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                  {index + 1}
                </div>
              </div>
            ))}

            {/* Add New Button */}
            {((formData as any).heroImages?.length || 0) < 20 && (
              <button
                type="button"
                onClick={() => {
                  setActiveField('heroImages');
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
                style={{
                  aspectRatio: '16/9',
                  border: '2px dashed #ddd',
                  borderRadius: '5px',
                  background: '#f9f9f9',
                  cursor: uploading ? 'wait' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}
              >
                <span style={{ fontSize: '24px', marginBottom: '5px' }}>+</span>
                <span style={{ fontSize: '12px' }}>{uploading && activeField === 'heroImages' ? 'Uploading...' : 'Add Image'}</span>
              </button>
            )}
          </div>

          {/* URL Input for Hero Images */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Or paste image URL and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val) {
                    setFormData(prev => ({
                      ...prev,
                      heroImages: [...((prev as any).heroImages || []), val]
                    }));
                    e.currentTarget.value = '';
                  }
                }
              }}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
            Upload from computer or paste URL. Drag to reorder (coming soon).
          </p>
        </div>

        {/* About Images */}
        <div style={{ marginBottom: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
            About Page Images (Max 20)
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Existing Images */}
            {(formData as any).aboutImages?.map((img: string, index: number) => (
              <div key={index} style={{ position: 'relative', aspectRatio: '16/9', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                <img src={img} alt={`About ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...((formData as any).aboutImages || [])];
                    newImages.splice(index, 1);
                    setFormData(prev => ({ ...prev, aboutImages: newImages }));
                  }}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}
                >
                  ×
                </button>
                <div style={{ position: 'absolute', bottom: '5px', left: '5px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                  {index + 1}
                </div>
              </div>
            ))}

            {/* Add New Button */}
            {((formData as any).aboutImages?.length || 0) < 20 && (
              <button
                type="button"
                onClick={() => {
                  setActiveField('aboutImages');
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
                style={{
                  aspectRatio: '16/9',
                  border: '2px dashed #ddd',
                  borderRadius: '5px',
                  background: '#f9f9f9',
                  cursor: uploading ? 'wait' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}
              >
                <span style={{ fontSize: '24px', marginBottom: '5px' }}>+</span>
                <span style={{ fontSize: '12px' }}>{uploading && activeField === 'aboutImages' ? 'Uploading...' : 'Add Image'}</span>
              </button>
            )}
          </div>

          {/* URL Input for About Images */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Or paste image URL and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val) {
                    setFormData(prev => ({
                      ...prev,
                      aboutImages: [...((prev as any).aboutImages || []), val]
                    }));
                    e.currentTarget.value = '';
                  }
                }
              }}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg,image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
        />
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Supported: JPG, PNG, GIF, WebP, SVG (Max 10MB)</p>

        {/* Videos */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Featured Videos</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Paste any YouTube link (e.g., https://www.youtube.com/watch?v=...) and it will be automatically converted.</p>
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 1</label>
          <input type="text" name="videoUrl1" value={formData.videoUrl1 || ''} onChange={handleChange} placeholder="Paste YouTube Link" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }} />
          <input type="text" name="videoTitle1" value={(formData as any).videoTitle1 || ''} onChange={handleChange} placeholder="Video 1 Title/Caption" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 2</label>
          <input type="text" name="videoUrl2" value={formData.videoUrl2 || ''} onChange={handleChange} placeholder="Paste YouTube Link" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }} />
          <input type="text" name="videoTitle2" value={(formData as any).videoTitle2 || ''} onChange={handleChange} placeholder="Video 2 Title/Caption" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video 3</label>
          <input type="text" name="videoUrl3" value={formData.videoUrl3 || ''} onChange={handleChange} placeholder="Paste YouTube Link" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }} />
          <input type="text" name="videoTitle3" value={(formData as any).videoTitle3 || ''} onChange={handleChange} placeholder="Video 3 Title/Caption" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
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

        {/* Payment Settings */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' }}>Payment Settings (QR Code)</h3>
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>UPI ID (Optional)</label>
          <input type="text" name="upiId" value={(formData as any).upiId || ''} onChange={handleChange} placeholder="e.g. business@upi" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment Instructions</label>
          <textarea name="paymentInstructions" value={(formData as any).paymentInstructions || ''} onChange={handleChange} placeholder="Instructions for the user..." rows={3} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment QR Code Image</label>
          
          {(formData as any).paymentQRCode ? (
            <div style={{ position: 'relative', width: '200px', marginBottom: '10px' }}>
              <img src={(formData as any).paymentQRCode} alt="Payment QR" style={{ width: '100%', borderRadius: '5px', border: '1px solid #ddd' }} />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentQRCode: '' }))}
                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            </div>
          ) : (
            <div 
              onClick={() => {
                setActiveField('paymentQRCode');
                fileInputRef.current?.click();
              }}
              style={{ width: '200px', height: '200px', border: '2px dashed #ddd', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f9f9f9' }}
            >
              <span style={{ fontSize: '24px', color: '#888' }}>+</span>
              <span style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Upload QR Code</span>
            </div>
          )}
        </div>

        <button type="submit" className="cta-button" disabled={saving} style={{ width: '100%', border: 'none', cursor: saving ? 'wait' : 'pointer', marginTop: '20px' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
