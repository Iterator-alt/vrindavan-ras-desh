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
          {/* Product Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-shopping-bag" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Product Management</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Manage store products and inventory.</p>
            <Link href="/admin/products" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Products</Link>
          </div>

          {/* Blog Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-pen-fancy" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Blog Management</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Write and manage spiritual articles.</p>
            <Link href="/admin/blog/new" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Write New Post</Link>
          </div>

          {/* Site Settings */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-cog" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Site Settings</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>Update contact info and links.</p>
            <Link href="/admin/settings" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>Manage Settings</Link>
          </div>

          {/* Order Management */}
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            <h3><i className="fas fa-box" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>Order Management</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>View and manage customer orders.</p>
            <Link href="/admin/orders" className="cta-button" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>View Orders</Link>
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
