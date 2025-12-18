'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/shop-utils';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my-orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) {
    return <div className="container" style={{ paddingTop: '120px' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem' }} className="profile-layout">
        {/* Sidebar / Profile Info */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} 
              />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1rem' }}>
                {session.user.name?.[0] || session.user.email?.[0] || 'U'}
              </div>
            )}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{session.user.name || 'User'}</h2>
            <p style={{ color: '#666' }}>{session.user.email}</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e74c3c',
              background: 'white',
              color: '#e74c3c',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>

        {/* Main Content / Orders */}
        <div>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>My Orders</h1>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}></i>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
              <button 
                onClick={() => router.push('/shop')}
                className="cta-button"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {orders.map((order) => (
                <div key={order.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Order #{order.orderNumber}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{formatPrice(order.total)}</div>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '4px 10px', 
                        borderRadius: '15px', 
                        background: order.status === 'completed' ? '#d4edda' : '#fff3cd',
                        color: order.status === 'completed' ? '#155724' : '#856404',
                        display: 'inline-block',
                        marginTop: '4px'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        {item.product.images[0] && (
                          <img src={item.product.images[0]} alt={item.product.name} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.product.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
