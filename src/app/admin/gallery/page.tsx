'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  imageUrl: string
  category: string
  isActive: boolean
  sortOrder: number
}

const categories = [
  { id: 'general', name: 'General' },
  { id: 'darshan', name: 'Darshan' },
  { id: 'events', name: 'Events' },
  { id: 'festivals', name: 'Festivals' },
]

export default function AdminGalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'general',
    isActive: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchImages()
    }
  }, [status, router])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) {
        const data = await res.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (res.ok) {
        const data = await res.json()
        setFormData({ ...formData, imageUrl: data.url })
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageUrl) {
      alert('Please upload an image')
      return
    }

    try {
      const url = editingImage ? `/api/gallery/${editingImage.id}` : '/api/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        fetchImages()
        resetForm()
      } else {
        alert('Failed to save image')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save image')
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title || '',
      description: image.description || '',
      imageUrl: image.imageUrl,
      category: image.category,
      isActive: image.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchImages()
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete image')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'general',
      isActive: true
    })
    setEditingImage(null)
    setShowForm(false)
  }

  if (status === 'loading' || loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '100px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>
            &larr; Back to Dashboard
          </Link>
          <h1 style={{ color: 'var(--primary-color)' }}>Gallery Management</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Image'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editingImage ? 'Edit Image' : 'Add New Image'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Image *</label>
                {formData.imageUrl ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                    <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} style={{ display: 'block', marginTop: '0.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    {uploading && <span style={{ marginLeft: '1rem' }}>Uploading...</span>}
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>Or paste image URL:</p>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '0.5rem' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Image title (optional)"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Image description (optional)"
                  rows={3}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active (visible on website)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {editingImage ? 'Update Image' : 'Add Image'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: '#e5e7eb',
                    color: '#333',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {images.map(image => (
          <div key={image.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
              <img src={image.imageUrl} alt={image.title || 'Gallery image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{image.title || 'Untitled'}</p>
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{image.category}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(image)}
                  style={{ flex: 1, padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
          <p>No images in gallery yet. Click &quot;Add Image&quot; to get started.</p>
        </div>
      )}
    </div>
  )
}
