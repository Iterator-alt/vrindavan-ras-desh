'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import MiniCart from './MiniCart';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link href="/" className="logo">Vrindavan Ras Desh</Link>
                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    <i className="fas fa-bars"></i>
                </div>
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li><Link href="/#home" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link href="/#about" onClick={() => setIsOpen(false)}>About</Link></li>
                    <li><Link href="/shop" onClick={() => setIsOpen(false)}>Shop</Link></li>
                    <li><Link href="/#videos" onClick={() => setIsOpen(false)}>Videos</Link></li>
                    <li><Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
                    <li><Link href="/#contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                    {session ? (
                        <li><Link href="/admin" onClick={() => setIsOpen(false)} style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Admin</Link></li>
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
