'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/shop-utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const shipping = total > 500 ? 0 : 50;
  const tax = total * 0.18; // 18% GST
  const grandTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: '5rem', color: '#ddd', marginBottom: '1.5rem' }}></i>
            <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Add some spiritual items to your cart and start your devotional journey!
            </p>
            <Link href="/shop" className="cta-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container">
        <h1 className="section-title">Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div>
            {items.map((item) => (
              <div
                key={item.productId}
                className="cart-item-grid"
              >
                {/* Product Image */}
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                      <i className="fas fa-image" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Qty:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button & Subtotal */}
                <div className="cart-item-actions">
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginLeft: 'auto' // Pushes to right in desktop, overridden in mobile if needed
                    }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              style={{
                marginTop: '1rem',
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #e74c3c',
                color: '#e74c3c',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: '120px',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h3>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#666' }}>
                  <span>Subtotal ({items.length} items)</span>
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
              </div>

              {shipping > 0 && (
                <div
                  style={{
                    padding: '12px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#856404',
                    marginBottom: '1rem',
                  }}
                >
                  <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
                  Add {formatPrice(500 - total)} more for FREE shipping!
                </div>
              )}

              <div
                style={{
                  borderTop: '2px solid #eee',
                  paddingTop: '1rem',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--primary-color)' }}>{formatPrice(grandTotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="cta-button"
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                style={{
                  marginTop: '1rem',
                  display: 'block',
                  textAlign: 'center',
                  color: 'var(--primary-color)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
