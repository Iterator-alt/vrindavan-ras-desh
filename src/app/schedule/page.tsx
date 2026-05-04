'use client'

import { useState, useEffect } from 'react'
import './schedule.css'

interface ScheduleItem {
  id: string
  title: string
  description: string | null
  time: string
  day: string
  category: string
}

const days = [
  { id: 'daily', name: 'Daily' },
  { id: 'monday', name: 'Monday' },
  { id: 'tuesday', name: 'Tuesday' },
  { id: 'wednesday', name: 'Wednesday' },
  { id: 'thursday', name: 'Thursday' },
  { id: 'friday', name: 'Friday' },
  { id: 'saturday', name: 'Saturday' },
  { id: 'sunday', name: 'Sunday' },
  { id: 'special', name: 'Special' },
]

const categoryIcons: Record<string, string> = {
  aarti: 'fa-fire',
  darshan: 'fa-eye',
  bhog: 'fa-utensils',
  special: 'fa-star',
  default: 'fa-clock',
}

const categoryColors: Record<string, string> = {
  aarti: '#f59e0b',
  darshan: '#8b5cf6',
  bhog: '#10b981',
  special: '#ec4899',
  default: '#6b7280',
}

export default function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState('daily')

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule')
      if (res.ok) {
        const data = await res.json()
        setScheduleItems(data)
      }
    } catch (err) {
      console.error('Error fetching schedule:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = scheduleItems.filter(item =>
    item.day === selectedDay || item.day === 'daily'
  )

  // Group by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'default'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, ScheduleItem[]>)

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      aarti: 'Aarti Timings',
      darshan: 'Darshan Timings',
      bhog: 'Bhog Timings',
      special: 'Special Programs',
      default: 'Other',
    }
    return labels[category] || category
  }

  return (
    <div className="schedule-page">
      {/* Hero Section */}
      <section className="schedule-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Temple Schedule</h1>
          <p>Daily aarti, darshan, and seva timings</p>
        </div>
      </section>

      {/* Day Selector */}
      <section className="day-selector">
        <div className="container">
          <div className="day-tabs">
            {days.map(day => (
              <button
                key={day.id}
                className={`day-tab ${selectedDay === day.id ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.id)}
              >
                {day.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="schedule-content">
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading schedule...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="no-schedule">
              <i className="fas fa-calendar-times"></i>
              <p>No schedule items available for this day.</p>
              <p className="sub-text">Please check back later or select another day.</p>
            </div>
          ) : (
            <div className="schedule-categories">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="category-section">
                  <h2 className="category-title">
                    <span
                      className="category-icon"
                      style={{ background: categoryColors[category] || categoryColors.default }}
                    >
                      <i className={`fas ${categoryIcons[category] || categoryIcons.default}`}></i>
                    </span>
                    {getCategoryLabel(category)}
                  </h2>

                  <div className="schedule-timeline">
                    {items.map((item, index) => (
                      <div key={item.id} className="timeline-item">
                        <div
                          className="timeline-dot"
                          style={{ background: categoryColors[category] || categoryColors.default }}
                        ></div>
                        <div className="timeline-content">
                          <div className="time-badge">{item.time}</div>
                          <h3>{item.title}</h3>
                          {item.description && <p>{item.description}</p>}
                          {item.day !== 'daily' && (
                            <span className="day-badge">{item.day}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Default Schedule if no items */}
          {!loading && scheduleItems.length === 0 && (
            <div className="default-schedule">
              <h2>General Temple Timings</h2>
              <div className="timing-cards">
                <div className="timing-card">
                  <div className="timing-icon" style={{ background: '#f59e0b' }}>
                    <i className="fas fa-fire"></i>
                  </div>
                  <h3>Mangala Aarti</h3>
                  <p className="timing">4:30 AM</p>
                </div>
                <div className="timing-card">
                  <div className="timing-icon" style={{ background: '#8b5cf6' }}>
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Morning Darshan</h3>
                  <p className="timing">5:00 AM - 12:00 PM</p>
                </div>
                <div className="timing-card">
                  <div className="timing-icon" style={{ background: '#10b981' }}>
                    <i className="fas fa-utensils"></i>
                  </div>
                  <h3>Raj Bhog</h3>
                  <p className="timing">12:00 PM</p>
                </div>
                <div className="timing-card">
                  <div className="timing-icon" style={{ background: '#f59e0b' }}>
                    <i className="fas fa-fire"></i>
                  </div>
                  <h3>Sandhya Aarti</h3>
                  <p className="timing">7:00 PM</p>
                </div>
                <div className="timing-card">
                  <div className="timing-icon" style={{ background: '#8b5cf6' }}>
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Evening Darshan</h3>
                  <p className="timing">4:00 PM - 9:00 PM</p>
                </div>
                <div className="timing-card">
                  <div className="timing-icon" style={{ background: '#f59e0b' }}>
                    <i className="fas fa-fire"></i>
                  </div>
                  <h3>Shayan Aarti</h3>
                  <p className="timing">8:30 PM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Important Notes */}
      <section className="notes-section">
        <div className="container">
          <div className="notes-box">
            <h3><i className="fas fa-info-circle"></i> Important Notes</h3>
            <ul>
              <li>Timings may vary on special occasions and festivals</li>
              <li>Please maintain silence and decorum inside the temple</li>
              <li>Mobile phones should be on silent mode</li>
              <li>Photography may be restricted during certain aartis</li>
              <li>Special darshan available on Ekadashi and Purnima</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
