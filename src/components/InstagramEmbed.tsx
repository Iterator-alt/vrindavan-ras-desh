'use client';

import { useEffect, useRef, useState } from 'react';

interface InstagramEmbedProps {
  postUrl: string;
  fallbackImage?: string;
}

export default function InstagramEmbed({ postUrl, fallbackImage }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    
    script.onload = () => {
      // Process embeds after script loads
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Extract Instagram post ID from URL
  const getEmbedUrl = (url: string) => {
    // Handle different Instagram URL formats
    const match = url.match(/instagram\.com\/(p|reel)\/([^/?]+)/);
    if (match) {
      return `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(postUrl);

  if (hasError || !embedUrl) {
    // Fallback to static preview
    return (
      <div className="instagram-fallback">
        <a href={postUrl} target="_blank" rel="noopener noreferrer">
          {fallbackImage ? (
            <img src={fallbackImage} alt="Instagram Post" />
          ) : (
            <div className="instagram-placeholder">
              <i className="fab fa-instagram" style={{ fontSize: '3rem', color: '#E1306C' }}></i>
              <p style={{ marginTop: '1rem' }}>View on Instagram</p>
            </div>
          )}
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="instagram-embed-container">
      {isLoading && (
        <div className="instagram-loading">
          <div className="spinner"></div>
          <p>Loading Instagram post...</p>
        </div>
      )}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: 'calc(100% - 2px)',
        }}
      >
        <a href={postUrl} target="_blank" rel="noopener noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
}

// Extend Window interface for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
