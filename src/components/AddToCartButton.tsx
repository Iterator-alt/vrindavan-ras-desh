'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (product.stock === 0) {
    return (
      <div
        style={{
          padding: '16px',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
        }}
      >
        <i className="fas fa-times-circle" style={{ marginRight: '8px' }}></i>
        Out of Stock
      </div>
    );
  }

  return (
    <div>
      {/* Quantity Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Quantity:
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid #ddd',
              background: 'white',
              borderRadius: '8px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.color = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.color = '#333';
            }}
          >
            −
          </button>
          <span style={{ fontSize: '1.2rem', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid #ddd',
              background: 'white',
              borderRadius: '8px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.color = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.color = '#333';
            }}
          >
            +
          </button>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            ({product.stock} available)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleAddToCart}
          className="cta-button"
          style={{
            flex: 1,
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: added ? '#27ae60' : 'var(--primary-color)',
          }}
        >
          <i className={added ? 'fas fa-check' : 'fas fa-shopping-cart'}></i>
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          className="cta-button"
          style={{
            flex: 1,
            minWidth: '200px',
            background: 'var(--accent-color)',
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
