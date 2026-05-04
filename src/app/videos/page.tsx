'use client'

import { useState, useEffect } from 'react'
import './videos.css'

interface Video {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  thumbnailUrl: string | null
  category: string
  isFeatured: boolean
}

const categories = [
  { id: 'all', name: 'All Videos', icon: 'fa-play-circle' },
  { id: 'bhajan', name: 'Bhajans', icon: 'fa-music' },
  { id: 'discourse', name: 'Discourses', icon: 'fa-book-open' },
  { id: 'kirtan', name: 'Kirtan', icon: 'fa-om' },
  { id: 'darshan', name: 'Darshan', icon: 'fa-eye' },
  { id: 'festival', name: 'Festivals', icon: 'fa-star' },
]

function getYouTubeEmbedUrl(url: string): string {
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[2].length === 11 ? match[2] : null

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`
  }

  // If already an embed URL, return as is
  if (url.includes('/embed/')) {
    return url
  }

  return url
}

function getYouTubeThumbnail(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[2].length === 11 ? match[2] : null

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
  return '/images/video-placeholder.jpg'
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      if (res.ok) {
        const data = await res.json()
        setVideos(data)
      }
    } catch (err) {
      console.error('Error fetching videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory)

  const featuredVideos = videos.filter(v => v.isFeatured)

  return (
    <div className="videos-page">
      {/* Hero Section */}
      <section className="videos-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Divine Videos</h1>
          <p>Experience the bliss of Vrindavan through our spiritual content</p>
          <a
            href="https://www.youtube.com/@vrindavanrasdesh"
            target="_blank"
            rel="noopener noreferrer"
            className="subscribe-btn"
          >
            <i className="fab fa-youtube"></i> Subscribe to Our Channel
          </a>
        </div>
      </section>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Featured Videos</h2>
            <div className="featured-grid">
              {featuredVideos.slice(0, 3).map(video => (
                <div
                  key={video.id}
                  className="featured-video-card"
                  onClick={() => setPlayingVideo(video)}
                >
                  <div className="video-thumbnail">
                    <img
                      src={video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl)}
                      alt={video.title}
                    />
                    <div className="play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                    <span className="featured-badge">Featured</span>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    {video.description && <p>{video.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="category-filter">
        <div className="container">
          <div className="category-buttons">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i className={`fas ${cat.icon}`}></i>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Videos Grid */}
      <section className="videos-section">
        <div className="container">
          <h2 className="section-title">
            {categories.find(c => c.id === selectedCategory)?.name || 'All Videos'}
          </h2>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading divine content...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="no-videos">
              <i className="fas fa-video-slash"></i>
              <p>No videos available in this category yet.</p>
              <a
                href="https://www.youtube.com/@vrindavanrasdesh"
                target="_blank"
                rel="noopener noreferrer"
                className="visit-channel-btn"
              >
                Visit Our YouTube Channel
              </a>
            </div>
          ) : (
            <div className="videos-grid">
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  className="video-card"
                  onClick={() => setPlayingVideo(video)}
                >
                  <div className="video-thumbnail">
                    <img
                      src={video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl)}
                      alt={video.title}
                    />
                    <div className="play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                    <span className="category-badge">{video.category}</span>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    {video.description && (
                      <p>{video.description.substring(0, 100)}{video.description.length > 100 ? '...' : ''}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Want More Divine Content?</h2>
            <p>Subscribe to our YouTube channel for daily spiritual videos, bhajans, and darshan.</p>
            <a
              href="https://www.youtube.com/@vrindavanrasdesh"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button youtube"
            >
              <i className="fab fa-youtube"></i> Subscribe Now
            </a>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="video-modal" onClick={() => setPlayingVideo(null)}>
          <button className="modal-close" onClick={() => setPlayingVideo(null)}>
            <i className="fas fa-times"></i>
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-player">
              <iframe
                src={`${getYouTubeEmbedUrl(playingVideo.youtubeUrl)}?autoplay=1`}
                title={playingVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-info">
              <h3>{playingVideo.title}</h3>
              {playingVideo.description && <p>{playingVideo.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
