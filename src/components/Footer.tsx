'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Settings {
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
}

export default function Footer() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand Section */}
                        <div className="footer-section brand-section">
                            <h3 className="footer-logo">🙏 Vrindavan Ras Desh</h3>
                            <p className="footer-tagline">
                                Spreading the divine love of Vraja through devotion, seva, and spiritual teachings.
                            </p>
                            <div className="social-links">
                                <a
                                    href="https://www.youtube.com/@vrindavanrasdesh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link youtube"
                                    aria-label="YouTube"
                                >
                                    <i className="fab fa-youtube"></i>
                                </a>
                                {settings?.instagramUrl && (
                                    <a
                                        href={settings.instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link instagram"
                                        aria-label="Instagram"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                )}
                                {settings?.facebookUrl && (
                                    <a
                                        href={settings.facebookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link facebook"
                                        aria-label="Facebook"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul className="footer-links">
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/gallery">Gallery</Link></li>
                                <li><Link href="/videos">Videos</Link></li>
                                <li><Link href="/schedule">Temple Schedule</Link></li>
                                <li><Link href="/blog">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="footer-section">
                            <h4>Services</h4>
                            <ul className="footer-links">
                                <li><Link href="/shop">Divine Shop</Link></li>
                                <li><Link href="/donate">Donate / Seva</Link></li>
                                <li><Link href="/contact">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-section">
                            <h4>Contact Us</h4>
                            <ul className="contact-info">
                                {settings?.address && (
                                    <li>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{settings.address}</span>
                                    </li>
                                )}
                                {settings?.contactPhone && (
                                    <li>
                                        <i className="fas fa-phone-alt"></i>
                                        <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
                                    </li>
                                )}
                                {settings?.contactEmail && (
                                    <li>
                                        <i className="fas fa-envelope"></i>
                                        <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p className="copyright">
                        &copy; {currentYear} Vrindavan Ras Desh. All Rights Reserved.
                    </p>
                    <p className="blessing">
                        Jai Shri Radhe! Jai Shri Krishna! 🙏
                    </p>
                </div>
            </div>

            <style jsx>{`
                .site-footer {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: #fff;
                }

                .footer-top {
                    padding: 4rem 0 3rem;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr;
                    gap: 3rem;
                }

                .footer-section h4 {
                    color: #fbbf24;
                    font-size: 1.1rem;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                    position: relative;
                    padding-bottom: 0.8rem;
                }

                .footer-section h4::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 40px;
                    height: 2px;
                    background: var(--primary-color);
                }

                .footer-logo {
                    font-family: var(--heading-font);
                    font-size: 1.5rem;
                    color: white;
                    margin-bottom: 1rem;
                }

                .footer-tagline {
                    color: #a0aec0;
                    line-height: 1.7;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                .social-links {
                    display: flex;
                    gap: 0.8rem;
                }

                .social-link {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    transform: translateY(-3px);
                }

                .social-link.youtube {
                    background: #FF0000;
                }

                .social-link.instagram {
                    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                }

                .social-link.facebook {
                    background: #1877F2;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li {
                    margin-bottom: 0.8rem;
                }

                .footer-links a {
                    color: #a0aec0;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }

                .footer-links a:hover {
                    color: #fbbf24;
                    padding-left: 5px;
                }

                .contact-info {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .contact-info li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.8rem;
                    margin-bottom: 1rem;
                    color: #a0aec0;
                    font-size: 0.95rem;
                }

                .contact-info li i {
                    color: var(--primary-color);
                    margin-top: 3px;
                    width: 16px;
                }

                .contact-info a {
                    color: #a0aec0;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .contact-info a:hover {
                    color: #fbbf24;
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding: 1.5rem 0;
                    text-align: center;
                }

                .footer-bottom .container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .copyright {
                    color: #718096;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .blessing {
                    color: #fbbf24;
                    font-size: 0.95rem;
                    margin: 0;
                }

                @media (max-width: 992px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .footer-top {
                        padding: 3rem 0 2rem;
                    }
                }
            `}</style>
        </footer>
    );
}
