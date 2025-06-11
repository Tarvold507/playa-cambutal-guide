
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes,
  priority = false,
  placeholder = 'empty',
  onLoad,
  onError 
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setImageError(true);
      onError?.();
    };

    // Start loading immediately for priority images
    if (priority) {
      img.src = src;
    } else {
      // Use intersection observer for non-priority images
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            img.src = src;
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      const element = document.getElementById(`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }
  }, [src, priority, onLoad, onError]);

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div 
      id={`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`relative overflow-hidden ${className}`}
    >
      {placeholder === 'blur' && !imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      
      <img
        src={imageLoaded || priority ? src : undefined}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  );
};

export default OptimizedImage;
