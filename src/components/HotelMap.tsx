
import { MapPin } from 'lucide-react';

interface HotelMapProps {
  latitude: number | null;
  longitude: number | null;
  name: string;
  address: string;
}

const HotelMap = ({ latitude, longitude, name, address }: HotelMapProps) => {
  if (!latitude || !longitude) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">Location information not available</p>
        <p className="text-sm text-gray-500 mt-1">{address}</p>
      </div>
    );
  }

  // Create Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${latitude}%2C${longitude}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <MapPin className="h-5 w-5 text-venao-dark" />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      </div>
      
      <div className="aspect-video rounded-lg overflow-hidden border">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${name}`}
        />
      </div>
      
      <div className="flex justify-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-venao-dark hover:text-venao underline text-sm"
        >
          View in Google Maps
        </a>
      </div>
    </div>
  );
};

export default HotelMap;
