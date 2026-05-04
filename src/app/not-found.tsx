import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1a1a 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        fontSize: '8rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #b01746, #ab9353)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}>
        404
      </div>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        fontFamily: 'var(--font-heading)',
      }}>
        Page Not Found
      </h1>
      <p style={{
        fontSize: '1.1rem',
        color: '#ccc',
        marginBottom: '2rem',
        maxWidth: '500px',
      }}>
        The page you are looking for might have been moved or doesn&apos;t exist.
        Let us guide you back to the divine path.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #b01746, #851049)',
            color: 'white',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'transform 0.3s ease',
          }}
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          style={{
            padding: '12px 30px',
            background: 'transparent',
            color: '#ab9353',
            border: '2px solid #ab9353',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          Visit Shop
        </Link>
      </div>
      <p style={{
        marginTop: '3rem',
        fontSize: '1.5rem',
        color: '#ab9353',
        fontStyle: 'italic',
      }}>
        Jai Shri Radhe!
      </p>
    </div>
  );
}
