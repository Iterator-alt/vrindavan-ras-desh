'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './donation-settings.css'

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
  donationPageUrl: string
  sewaOptions: SewaOption[]
  pageTitle: string
  pageSubtitle: string
  pageDescription: string
  heroImage: string
  isEnabled: boolean
}

export default function DonationSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<DonationSettings>({
    donationPageUrl: '',
    sewaOptions: [],
    pageTitle: 'Support Our Seva',
    pageSubtitle: 'Contribute to the divine service',
    pageDescription: '',
    heroImage: '',
    isEnabled: true
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/donation-settings')
      if (res.ok) {
        const data = await res.json()
        setSettings({
          donationPageUrl: data.donationPageUrl || '',
          sewaOptions: data.sewaOptions || [],
          pageTitle: data.pageTitle || 'Support Our Seva',
          pageSubtitle: data.pageSubtitle || 'Contribute to the divine service',
          pageDescription: data.pageDescription || '',
          heroImage: data.heroImage || '',
          isEnabled: data.isEnabled ?? true
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      alert('Failed to load donation settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/donation-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        alert('Donation settings saved successfully!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save donation settings')
    } finally {
      setSaving(false)
    }
  }

  const addSewaOption = () => {
    const newSewa: SewaOption = {
      id: `seva-${Date.now()}`,
      title: 'New Seva',
      description: 'Description of the seva',
      amount: 1000,
      icon: '🙏',
      image: '',
      isActive: true
    }
    setSettings({ ...settings, sewaOptions: [...settings.sewaOptions, newSewa] })
  }

  const updateSewaOption = (index: number, field: keyof SewaOption, value: any) => {
    const updated = [...settings.sewaOptions]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, sewaOptions: updated })
  }

  const deleteSewaOption = (index: number) => {
    if (confirm('Are you sure you want to delete this seva option?')) {
      const updated = settings.sewaOptions.filter((_, i) => i !== index)
      setSettings({ ...settings, sewaOptions: updated })
    }
  }

  if (loading) {
    return <div className="admin-container"><p>Loading...</p></div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Donation Page Settings</h1>
        <button onClick={() => router.push('/admin')} className="back-button">
          ← Back to Admin
        </button>
      </div>

      <div className="settings-form">
        {/* Page Settings */}
        <section className="form-section">
          <h2>Page Configuration</h2>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.isEnabled}
                onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
              />
              Enable Donation Page
            </label>
          </div>

          <div className="form-group">
            <label>External Donation URL (Production)</label>
            <input
              type="url"
              value={settings.donationPageUrl}
              onChange={(e) => setSettings({ ...settings, donationPageUrl: e.target.value })}
              placeholder="https://donate.example.com"
            />
            <small>Leave empty to keep donations internal. In production, users will be redirected here.</small>
          </div>

          <div className="form-group">
            <label>Page Title</label>
            <input
              type="text"
              value={settings.pageTitle}
              onChange={(e) => setSettings({ ...settings, pageTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Page Subtitle</label>
            <input
              type="text"
              value={settings.pageSubtitle}
              onChange={(e) => setSettings({ ...settings, pageSubtitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Page Description</label>
            <textarea
              value={settings.pageDescription}
              onChange={(e) => setSettings({ ...settings, pageDescription: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Hero Image URL</label>
            <input
              type="url"
              value={settings.heroImage}
              onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
              placeholder="https://example.com/hero.jpg"
            />
          </div>
        </section>

        {/* Seva Options */}
        <section className="form-section">
          <div className="section-header">
            <h2>Seva Options</h2>
            <button onClick={addSewaOption} className="add-button">+ Add Seva</button>
          </div>

          <div className="seva-options-list">
            {settings.sewaOptions.map((seva, index) => (
              <div key={seva.id} className="seva-option-card">
                <div className="seva-option-header">
                  <h3>Seva Option #{index + 1}</h3>
                  <button onClick={() => deleteSewaOption(index)} className="delete-button">
                    🗑️ Delete
                  </button>
                </div>

                <div className="seva-option-fields">
                  <div className="form-group">
                    <label>Active</label>
                    <input
                      type="checkbox"
                      checked={seva.isActive}
                      onChange={(e) => updateSewaOption(index, 'isActive', e.target.checked)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={seva.title}
                      onChange={(e) => updateSewaOption(index, 'title', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={seva.description}
                      onChange={(e) => updateSewaOption(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Amount (₹)</label>
                      <input
                        type="number"
                        value={seva.amount}
                        onChange={(e) => updateSewaOption(index, 'amount', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label>Icon (Emoji)</label>
                      <input
                        type="text"
                        value={seva.icon}
                        onChange={(e) => updateSewaOption(index, 'icon', e.target.value)}
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                      type="url"
                      value={seva.image}
                      onChange={(e) => updateSewaOption(index, 'image', e.target.value)}
                      placeholder="https://example.com/seva.jpg"
                    />
                  </div>
                </div>
              </div>
            ))}

            {settings.sewaOptions.length === 0 && (
              <p className="no-seva-message">No seva options yet. Click "Add Seva" to create one.</p>
            )}
          </div>
        </section>

        {/* Save Button */}
        <div className="form-actions">
          <button onClick={handleSave} disabled={saving} className="save-button">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          <a href="/donate" target="_blank" className="preview-button">
            Preview Donation Page →
          </a>
        </div>
      </div>
    </div>
  )
}
