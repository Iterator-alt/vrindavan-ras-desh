'use client'

import { useState, useEffect } from 'react'
import './contact.css'

interface ContactSettings {
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  mapEmbedUrl: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  youtubeUrl: string | null
}

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', phone: '', email: '', message: '' })
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We&apos;d love to hear from you. Reach out for any queries or seva opportunities.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p className="info-subtitle">
                Feel free to reach out to us for any queries about our temple, events, or how you can participate in seva.
              </p>

              <div className="info-cards">
                {settings?.address && (
                  <div className="info-card">
                    <div className="info-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="info-content">
                      <h3>Visit Us</h3>
                      <p>{settings.address}</p>
                    </div>
                  </div>
                )}

                {settings?.contactPhone && (
                  <div className="info-card">
                    <div className="info-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="info-content">
                      <h3>Call Us</h3>
                      <p><a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></p>
                    </div>
                  </div>
                )}

                {settings?.contactEmail && (
                  <div className="info-card">
                    <div className="info-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="info-content">
                      <h3>Email Us</h3>
                      <p><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>
                    </div>
                  </div>
                )}

                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="info-content">
                    <h3>Temple Timings</h3>
                    <p>Open Daily: 4:30 AM - 12:00 PM & 4:00 PM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a
                    href="https://www.youtube.com/@vrindavanrasdesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link youtube"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  {settings?.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {settings?.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We will get back to you soon.</p>
                  <p className="radhe">Jai Shri Radhe!</p>
                  <button
                    className="send-another-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2>Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          placeholder="Enter your phone"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email (Optional)</label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Your Message *</label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    {error && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i> {error}
                      </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {settings?.mapEmbedUrl ? (
        <section className="map-section">
          <div className="map-container">
            <iframe
              src={settings.mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      ) : (
        <section className="map-section">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14165.686730879478!2d77.65!3d27.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397371163d4b8c3d%3A0x45c7c4c4f18cce06!2sVrindavan%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      )}

      {/* Directions Section */}
      <section className="directions-section">
        <div className="container">
          <h2 className="section-title">How to Reach Us</h2>
          <div className="directions-grid">
            <div className="direction-card">
              <div className="direction-icon">
                <i className="fas fa-plane"></i>
              </div>
              <h3>By Air</h3>
              <p>Nearest airport is Indira Gandhi International Airport, Delhi (150 km). From there, take a taxi or bus to Vrindavan.</p>
            </div>
            <div className="direction-card">
              <div className="direction-icon">
                <i className="fas fa-train"></i>
              </div>
              <h3>By Train</h3>
              <p>Nearest railway station is Mathura Junction (12 km). Auto-rickshaws and taxis are easily available from the station.</p>
            </div>
            <div className="direction-card">
              <div className="direction-icon">
                <i className="fas fa-bus"></i>
              </div>
              <h3>By Road</h3>
              <p>Vrindavan is well connected by road. Regular buses run from Delhi, Agra, and other major cities.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
