'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroCarouselProps {
  images: (string | null | undefined)[];
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroCarousel({ images, title, subtitle, ctaText = 'Watch Videos', ctaLink = '#videos' }: HeroCarouselProps) {
  // Filter out null/undefined images
  const validImages = images.filter((img): img is string => !!img);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || validImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, validImages.length]);

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
  };

  // If no images, show default background
  if (validImages.length === 0) {
    return (
      <header 
        id="home" 
        className="hero" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1561583669-7c875954d72d?q=80&w=1920&auto=format&fit=crop')`
        }}
      >
        <div className="container hero-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <a href={ctaLink} className="cta-button">{ctaText}</a>
        </div>
      </header>
    );
  }

  return (
    <header 
      id="home" 
      className="hero hero-carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      <div className="carousel-images">
        {validImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${image}')`,
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="container hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <a href={ctaLink} className="cta-button">{ctaText}</a>
      </div>

      {/* Navigation Dots */}
      {validImages.length > 1 && (
        <div className="carousel-dots">
          {validImages.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </header>
  );
}
