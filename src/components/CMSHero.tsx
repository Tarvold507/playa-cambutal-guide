
import { ChevronDown } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';

interface CMSHeroProps {
  pagePath: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  fallbackImageSrc: string;
}

const CMSHero = ({ pagePath, fallbackTitle, fallbackSubtitle, fallbackImageSrc }: CMSHeroProps) => {
  // Use CMS content with fallback to provided props
  const cmsContent = useCMSContent(pagePath, 'hero', {
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    imageSrc: fallbackImageSrc
  });

  const scrollToContent = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const title = cmsContent?.title || fallbackTitle;
  const subtitle = cmsContent?.subtitle || fallbackSubtitle;
  const imageSrc = cmsContent?.imageSrc || fallbackImageSrc;

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        {/* Gradient Overlay */}
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
        
        {/* Scroll Down Indicator */}
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

export default CMSHero;
