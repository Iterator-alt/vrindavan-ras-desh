'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ScheduleItem {
  id: string
  title: string
  description: string | null
  time: string
  day: string
  category: string
  isActive: boolean
  sortOrder: number
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

const categories = [
  { id: 'aarti', name: 'Aarti', icon: '🔥' },
  { id: 'darshan', name: 'Darshan', icon: '👁️' },
  { id: 'bhog', name: 'Bhog', icon: '🍽️' },
  { id: 'special', name: 'Special', icon: '⭐' },
]

export default function AdminSchedulePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    day: 'daily',
    category: 'aarti',
    isActive: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchSchedule()
    }
  }, [status, router])

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule')
      if (res.ok) {
        const data = await res.json()
        setScheduleItems(data)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.time) {
      alert('Please fill in title and time')
      return
    }

    try {
      const url = editingItem ? `/api/schedule/${editingItem.id}` : '/api/schedule'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        fetchSchedule()
        resetForm()
      } else {
        alert('Failed to save schedule item')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save schedule item')
    }
  }

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      time: item.time,
      day: item.day,
      category: item.category,
      isActive: item.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule item?')) return

    try {
      const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSchedule()
      } else {
        alert('Failed to delete schedule item')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete schedule item')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time: '',
      day: 'daily',
      category: 'aarti',
      isActive: true
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const getCategoryIcon = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.icon || '⏰'
  }

  if (status === 'loading' || loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '100px 20px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>
            &larr; Back to Dashboard
          </Link>
          <h1 style={{ color: 'var(--primary-color)' }}>Schedule Management</h1>
          <p style={{ color: '#666' }}>Manage aarti, darshan, and bhog timings</p>
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
          {showForm ? 'Cancel' : '+ Add Schedule Item'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editingItem ? 'Edit Schedule Item' : 'Add New Schedule Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Mangala Aarti"
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 4:30 AM"
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  >
                    {days.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description or notes"
                  rows={2}
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
                  {editingItem ? 'Update' : 'Add Item'}
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

      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Title</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Time</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Day</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Category</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduleItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getCategoryIcon(item.category)}</span>
                    <span style={{ fontWeight: '500' }}>{item.title}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '0.9rem' }}>
                    {item.time}
                  </span>
                </td>
                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item.day}</td>
                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item.category}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ padding: '6px 12px', background: '#f3f4f6', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {scheduleItems.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
            <p>No schedule items yet. Click &quot;Add Schedule Item&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
