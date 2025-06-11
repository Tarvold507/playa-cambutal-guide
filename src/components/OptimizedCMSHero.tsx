
import { ChevronDown } from 'lucide-react';
import { useOptimizedPageContent } from '@/hooks/useOptimizedPageContent';
import { useState, useEffect } from 'react';

interface OptimizedCMSHeroProps {
  pagePath: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  fallbackImageSrc: string;
}

const OptimizedCMSHero = ({ pagePath, fallbackTitle, fallbackSubtitle, fallbackImageSrc }: OptimizedCMSHeroProps) => {
  const { getContentBySection, isLoading } = useOptimizedPageContent(pagePath);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const heroContent = getContentBySection('hero', {
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    imageSrc: fallbackImageSrc
  });

  const title = heroContent?.title || fallbackTitle;
  const subtitle = heroContent?.subtitle || fallbackSubtitle;
  const imageSrc = heroContent?.imageSrc || fallbackImageSrc;

  // Preload the hero image
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = imageSrc;
    }
  }, [imageSrc]);

  const scrollToContent = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show optimized loading state
  if (isLoading || (!imageLoaded && !imageError)) {
    return (
      <div className="relative h-screen w-full bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="w-96 h-12 bg-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="w-80 h-8 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Optimized Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
        )}
        
        <button 
          onClick={scrollToContent}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white hover:text-venao-light transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-10 w-10 animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default OptimizedCMSHero;
