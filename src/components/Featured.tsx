
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
  linkText: string;
  imageOnRight?: boolean;
}

const Featured = ({ 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  link, 
  linkText, 
  imageOnRight = false 
}: FeaturedProps) => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className={`flex flex-col ${imageOnRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <img 
                src={imageSrc} 
                alt={imageAlt} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {title}
            </h2>
            <div className="text-gray-600 space-y-4 mb-6">
              <p>{description}</p>
            </div>
            <Link 
              to={link}
              className="inline-flex items-center gap-2 text-venao font-semibold hover:text-venao-dark transition-colors"
            >
              {linkText} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
