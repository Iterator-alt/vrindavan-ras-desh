'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Donation {
  id: string
  donationNumber: string
  donorName: string
  donorPhone: string
  donorEmail: string | null
  sevaTitle: string
  amount: number
  transactionId: string | null
  paymentStatus: string
  createdAt: string
}

export default function AdminDonationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchDonations()
    }
  }, [status, router])

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations')
      if (res.ok) {
        const data = await res.json()
        setDonations(data)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus })
      })

      if (res.ok) {
        fetchDonations()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const filteredDonations = filter === 'all'
    ? donations
    : donations.filter(d => d.paymentStatus === filter)

  const totalAmount = donations
    .filter(d => d.paymentStatus === 'verified')
    .reduce((sum, d) => sum + d.amount, 0)

  const pendingCount = donations.filter(d => d.paymentStatus === 'pending').length
  const verifiedCount = donations.filter(d => d.paymentStatus === 'verified').length

  if (status === 'loading' || loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '100px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ color: 'var(--primary-color)' }}>Donation Management</h1>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Verified Total</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Pending Verification</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{pendingCount}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Verified</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{verifiedCount}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Donations</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{donations.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        {['all', 'pending', 'verified', 'failed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              border: filter === f ? 'none' : '1px solid #ddd',
              background: filter === f ? 'var(--primary-color)' : 'white',
              color: filter === f ? 'white' : '#333',
              borderRadius: '20px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Donations Table */}
      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Donation #</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Donor</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Seva</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Transaction ID</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map(donation => (
                <tr key={donation.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                      {donation.donationNumber}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: '500', marginBottom: '0.2rem' }}>{donation.donorName}</p>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>{donation.donorPhone}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>{donation.sevaTitle}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                    ₹{donation.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {donation.transactionId || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      background: donation.paymentStatus === 'verified' ? '#dcfce7' :
                                  donation.paymentStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: donation.paymentStatus === 'verified' ? '#16a34a' :
                             donation.paymentStatus === 'pending' ? '#d97706' : '#dc2626'
                    }}>
                      {donation.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                    {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {donation.paymentStatus === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleStatusChange(donation.id, 'verified')}
                          style={{
                            padding: '6px 12px',
                            background: '#dcfce7',
                            color: '#16a34a',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleStatusChange(donation.id, 'failed')}
                          style={{
                            padding: '6px 12px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {donation.paymentStatus !== 'pending' && (
                      <button
                        onClick={() => handleStatusChange(donation.id, 'pending')}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          color: '#666',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDonations.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
            <p>No donations found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
