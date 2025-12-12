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
        style={{ position: 'relative' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1561583669-7c875954d72d?q=80&w=1920&auto=format&fit=crop"
          alt="Vrindavan"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Overlay removed as requested */}
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
      style={{ position: 'relative' }}
    >
      {/* Background Images */}
      <div className="carousel-images">
        {validImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ opacity: index === currentIndex ? 1 : 0, transition: 'opacity 1s ease-in-out', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}
          >
            {/* Blurred Background Layer (Fills the screen) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              <Image
                src={image}
                alt="Background"
                fill
                style={{ objectFit: 'cover', filter: 'blur(20px)', transform: 'scale(1.1)' }}
                quality={50}
              />
              {/* Dark overlay to ensure text readability if we add it back, and for aesthetics */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)' }}></div>
            </div>

            {/* Main Image Layer (Fits the screen) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Content Overlay REMOVED as requested */}

      {/* Navigation Dots */}
      {validImages.length > 1 && (
        <div className="carousel-dots" style={{ zIndex: 20 }}>
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
