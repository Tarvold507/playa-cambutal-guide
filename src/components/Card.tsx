
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category?: string;
}

const Card = ({ title, description, imageSrc, link, category }: CardProps) => {
  return (
    <Link to={link} className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <div className="absolute top-4 left-4 bg-venao-dark/90 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </div>
        )}
      </div>
      <div className="p-5 bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-venao transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
};

export default Card;
