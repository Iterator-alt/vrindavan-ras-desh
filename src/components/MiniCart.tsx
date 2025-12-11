'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/shop-utils';

export default function MiniCart() {
  const { items, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Link 
      href="/cart" 
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center',
        padding: '8px 16px',
        background: 'var(--primary-color)',
        color: 'white',
        borderRadius: '25px',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--accent-color)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--primary-color)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
      Cart
      {totalItems > 0 && (
        <span 
          style={{ 
            marginLeft: '8px',
            background: 'white',
            color: 'var(--primary-color)',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '700',
          }}
        >
          {totalItems}
        </span>
      )}
    </Link>
  );
}
