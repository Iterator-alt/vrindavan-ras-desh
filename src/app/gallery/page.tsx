'use client'

import { useState, useEffect } from 'react'
import './gallery.css'

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  imageUrl: string
  category: string
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'darshan', name: 'Darshan' },
  { id: 'events', name: 'Events' },
  { id: 'festivals', name: 'Festivals' },
  { id: 'general', name: 'General' },
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) {
        const data = await res.json()
        setImages(data)
      }
    } catch (err) {
      console.error('Error fetching gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory)

  const openLightbox = (image: GalleryImage, index: number) => {
    setLightboxImage(image)
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    document.body.style.overflow = 'auto'
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredImages.length
      : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
    setLightboxIndex(newIndex)
    setLightboxImage(filteredImages[newIndex])
  }

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Divine Gallery</h1>
          <p>Glimpses of divine beauty and sacred moments from Vrindavan</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="gallery-filter">
        <div className="container">
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading divine moments...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="no-images">
              <i className="fas fa-images"></i>
              <p>No images available in this category yet.</p>
              <p className="sub-text">Check back soon for divine darshan!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  onClick={() => openLightbox(image, index)}
                >
                  <img src={image.imageUrl} alt={image.title || 'Gallery image'} />
                  <div className="gallery-item-overlay">
                    <i className="fas fa-expand"></i>
                    {image.title && <span className="image-title">{image.title}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <i className="fas fa-times"></i>
          </button>

          <button
            className="lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage.imageUrl} alt={lightboxImage.title || 'Gallery image'} />
            {(lightboxImage.title || lightboxImage.description) && (
              <div className="lightbox-info">
                {lightboxImage.title && <h3>{lightboxImage.title}</h3>}
                {lightboxImage.description && <p>{lightboxImage.description}</p>}
              </div>
            )}
          </div>

          <button
            className="lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
