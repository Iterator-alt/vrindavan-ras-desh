'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/shop-utils';

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>();

  const total = getTotalPrice();
  const shipping = total > 500 ? 0 : 50;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: total,
          tax,
          shipping,
          total: grandTotal,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // For now, we'll just simulate payment success
      // In production, you would integrate with Razorpay here
      alert('Order placed successfully! Order ID: ' + order.orderNumber);
      
      clearCart();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: '#f9f9f9' }}>
      <div className="container">
        <h1 className="section-title">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Checkout Form */}
            <div>
              {/* Contact Information */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Contact Information</h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Full Name *
                  </label>
                  <input
                    {...register('customerName', { required: 'Name is required' })}
                    type="text"
                    placeholder="Enter your full name"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                  {errors.customerName && (
                    <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.customerName.message}</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Email *
                    </label>
                    <input
                      {...register('customerEmail', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                      })}
                      type="email"
                      placeholder="your@email.com"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    {errors.customerEmail && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.customerEmail.message}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Phone *
                    </label>
                    <input
                      {...register('customerPhone', {
                        required: 'Phone is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' },
                      })}
                      type="tel"
                      placeholder="10-digit mobile number"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    {errors.customerPhone && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.customerPhone.message}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Shipping Address</h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Address *
                  </label>
                  <textarea
                    {...register('shippingAddress', { required: 'Address is required' })}
                    placeholder="House no., Street, Area"
                    rows={3}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
                  />
                  {errors.shippingAddress && (
                    <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.shippingAddress.message}</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      City *
                    </label>
                    <input
                      {...register('shippingCity', { required: 'City is required' })}
                      type="text"
                      placeholder="City"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    {errors.shippingCity && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.shippingCity.message}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      State *
                    </label>
                    <input
                      {...register('shippingState', { required: 'State is required' })}
                      type="text"
                      placeholder="State"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    {errors.shippingState && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.shippingState.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    PIN Code *
                  </label>
                  <input
                    {...register('shippingPincode', {
                      required: 'PIN code is required',
                      pattern: { value: /^[0-9]{6}$/, message: 'Invalid PIN code' },
                    })}
                    type="text"
                    placeholder="6-digit PIN code"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                  {errors.shippingPincode && (
                    <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errors.shippingPincode.message}</span>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Order Notes (Optional)</h3>
                <textarea
                  {...register('notes')}
                  placeholder="Any special instructions for delivery?"
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: '120px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Order Summary</h3>

                {/* Items */}
                <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <div key={item.productId} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#f5f5f5' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#666' }}>
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#666' }}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#666' }}>
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '700' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary-color)' }}>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="cta-button"
                  style={{
                    width: '100%',
                    opacity: processing ? 0.7 : 1,
                    cursor: processing ? 'wait' : 'pointer',
                  }}
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>

                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                  <i className="fas fa-lock" style={{ marginRight: '6px' }}></i>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
