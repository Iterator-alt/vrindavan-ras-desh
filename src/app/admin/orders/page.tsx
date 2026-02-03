'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/shop-utils';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container" style={{ paddingTop: '120px' }}>Loading...</div>;
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <h1 className="section-title">Order Management</h1>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>All Orders ({orders.length})</h2>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '3rem 0' }}>
            No orders received yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Order #</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Payment</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{order.orderNumber}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{order.customerName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{order.customerEmail}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                      {formatPrice(order.total)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        background: order.status === 'completed' ? '#d4edda' : '#fff3cd',
                        color: order.status === 'completed' ? '#155724' : '#856404'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        background: order.paymentStatus === 'paid' ? '#d4edda' : '#f8d7da',
                        color: order.paymentStatus === 'paid' ? '#155724' : '#721c24'
                      }}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{ 
                          padding: '6px 16px', 
                          background: 'var(--primary-color)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '5px', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem' 
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              Order Details: {selectedOrder.orderNumber}
            </h2>

            <div className="responsive-grid-2">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Customer Info</h3>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress}</p>
                <p>{selectedOrder.shippingCity}, {selectedOrder.shippingState} - {selectedOrder.shippingPincode}</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Order Items</h3>
            <div style={{ marginBottom: '2rem' }}>
              {selectedOrder.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                  {item.product.images[0] && (
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {item.quantity} x {formatPrice(item.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {formatPrice(item.total)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                Total: {formatPrice(selectedOrder.total)}
              </div>
            </div>

            {/* Admin Actions */}
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
               {selectedOrder.paymentStatus !== 'paid' && (
                 <button
                   onClick={async () => {
                     if (!confirm('Are you sure you want to mark this orderc as PAID? This will send a confirmation email to the customer.')) return;
                     
                     try {
                        const res = await fetch(`/api/orders/${selectedOrder.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ paymentStatus: 'paid' }),
                        });
                        
                        if (!res.ok) throw new Error('Failed to update');
                        
                        alert('Order marked as PAID');
                        setSelectedOrder(null);
                        fetchOrders();
                     } catch (err) {
                       alert('Failed to update order');
                       console.error(err);
                     }
                   }}
                   style={{
                     padding: '10px 20px',
                     background: '#28a745',
                     color: 'white',
                     border: 'none',
                     borderRadius: '5px',
                     cursor: 'pointer',
                     fontWeight: '600'
                   }}
                 >
                   Mark as Paid
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
