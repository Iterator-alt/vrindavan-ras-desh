import Link from 'next/link';

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          {/* Success Icon */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: '#27ae60',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
            }}
          >
            <i className="fas fa-check" style={{ fontSize: '3rem', color: 'white' }}></i>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#27ae60' }}>
            Order Placed Successfully!
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          {searchParams.orderId && (
            <div
              style={{
                background: '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                Order ID
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {searchParams.orderId}
              </div>
            </div>
          )}

          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              What's Next?
            </h3>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary-color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Order Confirmation
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    You'll receive an email confirmation shortly
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary-color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Processing
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    We'll prepare your order for shipment
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary-color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Delivery
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Your order will be delivered within 5-7 business days
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="cta-button">
              Continue Shopping
            </Link>
            <Link
              href="/"
              style={{
                padding: '14px 36px',
                background: 'transparent',
                color: 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
