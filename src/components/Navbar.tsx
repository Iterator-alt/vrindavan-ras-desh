'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MiniCart from './MiniCart';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link href="/" className="logo">Vrindavan Ras Desh</Link>
                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    <i className="fas fa-bars"></i>
                </div>
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li><Link href="/#home" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link href="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                    <li><Link href="/shop" onClick={() => setIsOpen(false)}>Shop</Link></li>
                    <li><Link href="/#videos" onClick={() => setIsOpen(false)}>Videos</Link></li>
                    <li><Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
                    <li><Link href="/#contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                    
                    {/* Donate Button */}
                    <li>
                        <a 
                          href="https://rzp.io/l/donate-placeholder" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="cta-button"
                          style={{ 
                            padding: '8px 20px', 
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                            marginLeft: '10px',
                            display: 'inline-block'
                          }}
                          onClick={() => setIsOpen(false)}
                        >
                          Donate
                        </a>
                    </li>

                    {session ? (
                        <li style={{ position: 'relative' }}>
                            <button 
                                onClick={() => router.push('/profile')}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {session.user?.image ? (
                                    <img 
                                        src={session.user.image} 
                                        alt={session.user.name || 'User'} 
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                                    </div>
                                )}
                            </button>
                        </li>
                    ) : (
                        <li><Link href="/login" onClick={() => setIsOpen(false)} style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</Link></li>
                    )}
                    <li style={{ marginLeft: '1rem' }}>
                        <MiniCart />
                    </li>
                </ul>
            </div>
        </nav>
    );
}
