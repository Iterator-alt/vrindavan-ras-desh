'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import MiniCart from './MiniCart';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link href="/" className="logo">Vrindavan Ras Desh</Link>
                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li><Link href="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link href="/about" onClick={closeMenu}>About</Link></li>
                    <li className="dropdown">
                        <span className="dropdown-trigger">
                            Media <i className="fas fa-chevron-down"></i>
                        </span>
                        <ul className="dropdown-menu">
                            <li><Link href="/gallery" onClick={closeMenu}><i className="fas fa-images"></i> Gallery</Link></li>
                            <li><Link href="/videos" onClick={closeMenu}><i className="fas fa-video"></i> Videos</Link></li>
                        </ul>
                    </li>
                    <li><Link href="/schedule" onClick={closeMenu}>Schedule</Link></li>
                    <li><Link href="/shop" onClick={closeMenu}>Shop</Link></li>
                    <li><Link href="/blog" onClick={closeMenu}>Blog</Link></li>
                    <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>

                    {/* Donate Button */}
                    <li>
                        <Link
                          href="/donate"
                          className="cta-button donate-btn"
                          onClick={closeMenu}
                        >
                          <i className="fas fa-heart"></i> Donate
                        </Link>
                    </li>

                    {session ? (
                        <li><Link href="/admin" onClick={closeMenu} className="admin-link">Admin</Link></li>
                    ) : (
                        <li><Link href="/login" onClick={closeMenu} className="login-link">Login</Link></li>
                    )}
                    <li className="cart-link">
                        <MiniCart />
                    </li>
                </ul>
            </div>

            <style jsx>{`
                .dropdown {
                    position: relative;
                }

                .dropdown-trigger {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .dropdown-trigger i {
                    font-size: 0.7rem;
                    transition: transform 0.3s ease;
                }

                .dropdown:hover .dropdown-trigger i {
                    transform: rotate(180deg);
                }

                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    min-width: 180px;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                    z-index: 100;
                    padding: 0.5rem 0;
                    list-style: none;
                }

                .dropdown:hover .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-menu li {
                    margin: 0;
                }

                .dropdown-menu li a {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.8rem 1.2rem;
                    color: #333;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .dropdown-menu li a:hover {
                    background: #f5f5f5;
                    color: var(--primary-color);
                }

                .dropdown-menu li a i {
                    width: 20px;
                    color: var(--primary-color);
                }

                .donate-btn {
                    padding: 8px 20px !important;
                    font-size: 0.9rem !important;
                    text-decoration: none !important;
                    margin-left: 10px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(139, 69, 19, 0.4); }
                    50% { box-shadow: 0 0 0 10px rgba(139, 69, 19, 0); }
                }

                .admin-link {
                    color: var(--primary-color) !important;
                    font-weight: bold !important;
                }

                .login-link {
                    color: var(--primary-color) !important;
                    font-weight: bold !important;
                }

                .cart-link {
                    margin-left: 1rem;
                }

                @media (max-width: 992px) {
                    .dropdown-menu {
                        position: static;
                        opacity: 1;
                        visibility: visible;
                        transform: none;
                        box-shadow: none;
                        background: transparent;
                        padding: 0;
                        padding-left: 1rem;
                    }

                    .dropdown-menu li a {
                        padding: 0.5rem 0;
                    }

                    .donate-btn {
                        margin-left: 0 !important;
                        margin-top: 1rem !important;
                    }
                }
            `}</style>
        </nav>
    );
}
