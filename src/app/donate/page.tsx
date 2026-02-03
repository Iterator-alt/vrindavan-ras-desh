import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import './donate.css'

interface SewaOption {
  id: string
  title: string
  description: string
  amount: number
  icon: string
  image: string
  isActive: boolean
}

export default async function DonatePage() {
  const settings = await prisma.donationSettings.findUnique({
    where: { id: 'default' }
  })

  if (!settings || !settings.isEnabled) {
    return (
      <div className="donate-page">
        <div className="container">
          <h1>Donation page is currently unavailable</h1>
          <Link href="/">Return to Home</Link>
        </div>
      </div>
    )
  }

  const sewaOptions = (settings.sewaOptions as SewaOption[]) || []
  const activeSewaOptions = sewaOptions.filter(option => option.isActive)

  // Determine if we should redirect to external URL
  const isDevelopment = process.env.NODE_ENV === 'development'
  const externalUrl = settings.donationPageUrl

  return (
    <div className="donate-page">
      {/* Hero Section */}
      <section className="donate-hero">
        {settings.heroImage && (
          <div className="hero-image-container">
            <img src={settings.heroImage} alt="Donation Hero" className="hero-image" />
          </div>
        )}
        <div className="hero-content">
          <h1 className="hero-title">{settings.pageTitle}</h1>
          <p className="hero-subtitle">{settings.pageSubtitle}</p>
          {settings.pageDescription && (
            <p className="hero-description">{settings.pageDescription}</p>
          )}
        </div>
      </section>

      {/* Seva Options Grid */}
      <section className="seva-section">
        <div className="container">
          <div className="seva-grid">
            {activeSewaOptions.map((seva) => (
              <div key={seva.id} className="seva-card">
                <div className="seva-icon">{seva.icon}</div>
                {seva.image && (
                  <div className="seva-image">
                    <img src={seva.image} alt={seva.title} />
                  </div>
                )}
                <h3 className="seva-title">{seva.title}</h3>
                <p className="seva-description">{seva.description}</p>
                <div className="seva-amount">₹{seva.amount.toLocaleString('en-IN')}</div>
                <button
                  className="seva-button"
                  onClick={() => {
                    if (isDevelopment || !externalUrl) {
                      // In development or no external URL, show alert
                      alert(`Selected: ${seva.title}\nAmount: ₹${seva.amount}\n\nIn production, this will redirect to the payment gateway.`)
                    } else {
                      // In production with external URL, redirect
                      const url = `${externalUrl}?seva=${seva.id}&amount=${seva.amount}&title=${encodeURIComponent(seva.title)}`
                      window.location.href = url
                    }
                  }}
                >
                  Offer Seva
                </button>
              </div>
            ))}
          </div>

          {activeSewaOptions.length === 0 && (
            <div className="no-seva">
              <p>No seva options available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="donate-cta">
        <div className="container">
          <h2>Your Contribution Makes a Difference</h2>
          <p>Every seva offered with devotion reaches the divine couple and blesses countless devotees.</p>
          <div className="cta-features">
            <div className="feature">
              <span className="feature-icon">🙏</span>
              <span>100% Transparent</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✨</span>
              <span>Direct Impact</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💝</span>
              <span>Tax Benefits</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
