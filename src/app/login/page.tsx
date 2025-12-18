'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto login after register
      await signIn('credentials', {
        email,
        password,
        callbackUrl,
      });

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333', fontFamily: 'var(--font-heading)' }}>
        {isRegistering ? 'Create Account' : 'Welcome Back'}
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        {isRegistering ? 'Join our spiritual community' : 'Sign in to continue your journey'}
      </p>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          background: 'white',
          color: '#333',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '1.5rem',
          transition: 'all 0.3s ease'
        }}
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
        Sign in with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#999' }}>
        <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
        <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
      </div>

      {isRegistering ? (
        // REGISTER FORM
        <form onSubmit={otpSent ? handleRegister : handleSendOtp}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={otpSent}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', background: otpSent ? '#f5f5f5' : 'white' }}
            />
          </div>

          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={otpSent}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', background: otpSent ? '#f5f5f5' : 'white' }}
            />
          </div>

          {otpSent && (
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Check your email (and spam folder) for the code.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-color)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Processing...' : (otpSent ? 'Verify & Register' : 'Send Verification Code')}
          </button>
        </form>
      ) : (
        // LOGIN FORM
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-color)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        {isRegistering ? (
          <p>Already have an account? <button onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button></p>
        ) : (
          <p>Don't have an account? <button onClick={() => setIsRegistering(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer' }}>Register</button></p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0', padding: '20px' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
