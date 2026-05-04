import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <h1 className="section-title">Admin Dashboard</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Welcome, <strong>{session.user?.name || session.user?.email}</strong>!
          <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#666', background: '#eee', padding: '2px 8px', borderRadius: '4px' }}>
            {session.user?.role}
          </span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* Gallery Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-images" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Gallery</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Manage photo gallery images.</p>
            <Link href="/admin/gallery" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Gallery</Link>
          </div>

          {/* Videos Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-video" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Videos</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Manage YouTube videos.</p>
            <Link href="/admin/videos" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Videos</Link>
          </div>

          {/* Schedule Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-clock" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Schedule</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Manage aarti and darshan timings.</p>
            <Link href="/admin/schedule" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Schedule</Link>
          </div>

          {/* Donations */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-rupee-sign" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Donations</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>View and verify donations.</p>
            <Link href="/admin/donations" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>View Donations</Link>
          </div>

          {/* Product Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-shopping-bag" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Products</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Manage store products and inventory.</p>
            <Link href="/admin/products" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Products</Link>
          </div>

          {/* Order Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-box" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Orders</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>View and manage customer orders.</p>
            <Link href="/admin/orders" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>View Orders</Link>
          </div>

          {/* Event Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-calendar-alt" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Events</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Add and update upcoming events.</p>
            <Link href="/admin/events" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Events</Link>
          </div>

          {/* Blog Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-pen-fancy" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Blog</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Write and manage spiritual articles.</p>
            <Link href="/admin/blog/new" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Write New Post</Link>
          </div>

          {/* Site Settings */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-cog" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Site Settings</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Update hero, videos, social links & more.</p>
            <Link href="/admin/settings" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Settings</Link>
          </div>

          {/* Donation Settings */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-hand-holding-heart" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Seva Options</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Manage seva/donation options.</p>
            <Link href="/admin/donation-settings" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Seva</Link>
          </div>

          {/* User Management (Superadmin Only) */}
          {session.user?.role === 'SUPERADMIN' && (
            <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
              <h3><i className="fas fa-users" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>User Management</h3>
              <p style={{ marginBottom: '1rem', color: '#666' }}>Create and manage admin users.</p>
              <button className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px', opacity: '0.7', cursor: 'not-allowed' }}>Coming Soon</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
