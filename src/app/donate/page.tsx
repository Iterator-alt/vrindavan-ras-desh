'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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

interface DonationSettings {
  donationPageUrl: string | null
  sewaOptions: SewaOption[]
  pageTitle: string
  pageSubtitle: string
  pageDescription: string | null
  heroImage: string | null
  isEnabled: boolean
}

interface SiteSettings {
  paymentQRCode: string | null
  upiId: string | null
  paymentInstructions: string | null
}

type Step = 'select' | 'details' | 'payment' | 'receipt'

interface DonorInfo {
  name: string
  phone: string
}

interface ReceiptData {
  donationNumber: string
  donorName: string
  donorPhone: string
  sevaTitle: string
  amount: number
  transactionId: string
  date: string
}

function generateDonationNumber(): string {
  const prefix = 'VRD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export default function DonatePage() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<DonationSettings | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [error, setError] = useState(false)

  const [step, setStep] = useState<Step>('select')
  const [selectedSeva, setSelectedSeva] = useState<SewaOption | null>(null)
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({ name: '', phone: '' })
  const [transactionId, setTransactionId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const [donationRes, siteRes] = await Promise.all([
        fetch('/api/donation-settings'),
        fetch('/api/settings')
      ])

      if (donationRes.ok) {
        const data = await donationRes.json()
        setSettings(data)
      } else {
        setError(true)
      }

      if (siteRes.ok) {
        const siteData = await siteRes.json()
        setSiteSettings(siteData)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSevaSelect = (seva: SewaOption) => {
    setSelectedSeva(seva)
    setStep('details')
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (donorInfo.name.trim() && donorInfo.phone.trim()) {
      setStep('payment')
    }
  }

  const handlePaymentConfirm = async () => {
    if (!transactionId.trim() || !selectedSeva) return

    setSubmitting(true)

    const donationNumber = generateDonationNumber()
    const receipt: ReceiptData = {
      donationNumber,
      donorName: donorInfo.name,
      donorPhone: donorInfo.phone,
      sevaTitle: selectedSeva.title,
      amount: selectedSeva.amount,
      transactionId: transactionId,
      date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short'
      })
    }

    try {
      // Save donation to database
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationNumber,
          donorName: donorInfo.name,
          donorPhone: donorInfo.phone,
          sevaTitle: selectedSeva.title,
          sevaId: selectedSeva.id,
          amount: selectedSeva.amount,
          transactionId: transactionId
        })
      })
    } catch (err) {
      console.error('Error saving donation:', err)
    }

    setReceiptData(receipt)
    setStep('receipt')
    setSubmitting(false)
  }

  const handleStartOver = () => {
    setStep('select')
    setSelectedSeva(null)
    setDonorInfo({ name: '', phone: '' })
    setTransactionId('')
    setReceiptData(null)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="donate-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !settings || !settings.isEnabled) {
    return (
      <div className="donate-page">
        <div className="error-container">
          <i className="fas fa-heart-broken"></i>
          <h1>Donation page is currently unavailable</h1>
          <p>Please try again later or contact us directly.</p>
          <Link href="/" className="back-btn">Return to Home</Link>
        </div>
      </div>
    )
  }

  const activeSewaOptions = settings.sewaOptions.filter(option => option.isActive)

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

      {/* Progress Steps */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className={`progress-step ${step === 'select' ? 'active' : ''} ${['details', 'payment', 'receipt'].includes(step) ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Select Seva</span>
          </div>
          <div className={`progress-step ${step === 'details' ? 'active' : ''} ${['payment', 'receipt'].includes(step) ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Your Details</span>
          </div>
          <div className={`progress-step ${step === 'payment' ? 'active' : ''} ${step === 'receipt' ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`progress-step ${step === 'receipt' ? 'active completed' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Receipt</span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Seva */}
      {step === 'select' && (
        <section className="seva-section">
          <div className="container">
            <h2 className="section-heading">Choose Your Seva</h2>
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
                    onClick={() => handleSevaSelect(seva)}
                  >
                    Select This Seva
                  </button>
                </div>
              ))}
            </div>

            {activeSewaOptions.length === 0 && (
              <div className="no-seva">
                <i className="fas fa-om"></i>
                <p>No seva options available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 2: Donor Details */}
      {step === 'details' && selectedSeva && (
        <section className="details-section">
          <div className="container">
            <div className="details-card">
              <div className="selected-seva-summary">
                <span className="seva-icon-small">{selectedSeva.icon}</span>
                <div>
                  <h4>{selectedSeva.title}</h4>
                  <p className="amount-small">₹{selectedSeva.amount.toLocaleString('en-IN')}</p>
                </div>
                <button className="change-btn" onClick={() => setStep('select')}>Change</button>
              </div>

              <h2>Enter Your Details</h2>
              <form onSubmit={handleDetailsSubmit} className="details-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="fas fa-user"></i> Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="fas fa-phone"></i> Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={() => setStep('select')}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                  <button type="submit" className="continue-btn">
                    Continue to Payment <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Payment */}
      {step === 'payment' && selectedSeva && (
        <section className="payment-section">
          <div className="container">
            <div className="payment-card">
              <div className="payment-header">
                <h2>Complete Your Payment</h2>
                <p>Scan the QR code or use UPI ID to pay</p>
              </div>

              <div className="payment-amount">
                <span>Amount to Pay</span>
                <strong>₹{selectedSeva.amount.toLocaleString('en-IN')}</strong>
              </div>

              <div className="payment-methods">
                {siteSettings?.paymentQRCode && (
                  <div className="qr-section">
                    <div className="qr-code">
                      <img src={siteSettings.paymentQRCode} alt="Payment QR Code" />
                    </div>
                    <p>Scan with any UPI app</p>
                  </div>
                )}

                {siteSettings?.upiId && (
                  <div className="upi-section">
                    <p className="upi-label">Or pay using UPI ID:</p>
                    <div className="upi-id">
                      <span>{siteSettings.upiId}</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(siteSettings.upiId || '')
                          alert('UPI ID copied!')
                        }}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>
                )}

                {siteSettings?.paymentInstructions && (
                  <div className="payment-instructions">
                    <p>{siteSettings.paymentInstructions}</p>
                  </div>
                )}
              </div>

              <div className="transaction-section">
                <h3>After Payment</h3>
                <p>Enter your UPI Transaction ID / Reference Number</p>
                <div className="form-group">
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g., 312456789012"
                    className="transaction-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={() => setStep('details')}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <button
                  type="button"
                  className="confirm-btn"
                  onClick={handlePaymentConfirm}
                  disabled={!transactionId.trim() || submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i> I Have Paid
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Receipt */}
      {step === 'receipt' && receiptData && (
        <section className="receipt-section">
          <div className="container">
            <div className="receipt-card" ref={receiptRef}>
              <div className="receipt-header">
                <div className="receipt-logo">
                  <span className="logo-icon">🙏</span>
                  <h2>Vrindavan Ras Desh</h2>
                </div>
                <div className="receipt-badge">
                  <i className="fas fa-check-circle"></i>
                  <span>Payment Received</span>
                </div>
              </div>

              <div className="receipt-body">
                <div className="receipt-number">
                  <span>Receipt No.</span>
                  <strong>{receiptData.donationNumber}</strong>
                </div>

                <div className="receipt-details">
                  <div className="detail-row">
                    <span className="label">Donor Name</span>
                    <span className="value">{receiptData.donorName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone</span>
                    <span className="value">{receiptData.donorPhone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Seva</span>
                    <span className="value">{receiptData.sevaTitle}</span>
                  </div>
                  <div className="detail-row highlight">
                    <span className="label">Amount</span>
                    <span className="value amount">₹{receiptData.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Transaction ID</span>
                    <span className="value">{receiptData.transactionId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date & Time</span>
                    <span className="value">{receiptData.date}</span>
                  </div>
                </div>

                <div className="receipt-message">
                  <p>🙏 <strong>Jai Shri Radhe!</strong></p>
                  <p>Thank you for your generous contribution. Your seva will be offered with devotion.</p>
                  <p>May Radha Rani bless you and your family with eternal happiness!</p>
                </div>

                <div className="receipt-footer">
                  <p>Please save this receipt for your records.</p>
                  <p className="note">* Payment is subject to verification. You will receive confirmation once verified.</p>
                </div>
              </div>
            </div>

            <div className="receipt-actions">
              <button className="print-btn" onClick={handlePrintReceipt}>
                <i className="fas fa-print"></i> Print Receipt
              </button>
              <button className="new-donation-btn" onClick={handleStartOver}>
                <i className="fas fa-heart"></i> Make Another Donation
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      {step === 'select' && (
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
                <span>Divine Blessings</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
