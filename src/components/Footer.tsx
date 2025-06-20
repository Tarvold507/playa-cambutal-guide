
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Playa Cambutal</h3>
            <p className="text-gray-300 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white text-sm">Home</Link></li>
              <li><Link to="/surf" className="text-gray-300 hover:text-white text-sm">Surfing</Link></li>
              <li><Link to="/eat" className="text-gray-300 hover:text-white text-sm">Restaurants</Link></li>
              <li><Link to="/stay" className="text-gray-300 hover:text-white text-sm">Hotels</Link></li>
              <li><Link to="/do" className="text-gray-300 hover:text-white text-sm">Activities</Link></li>
              <li><Link to="/calendar" className="text-gray-300 hover:text-white text-sm">Events</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white text-sm">Blog</Link></li>
            </ul>
          </div>

          {/* Travel Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel Info</h3>
            <ul className="space-y-2">
              <li><Link to="/info" className="text-gray-300 hover:text-white text-sm">Travel Guide</Link></li>
              <li><Link to="/transportation" className="text-gray-300 hover:text-white text-sm">Getting Here</Link></li>
              <li><Link to="/real-estate" className="text-gray-300 hover:text-white text-sm">Real Estate</Link></li>
              <li><Link to="/eat/centro-recreativo-jake" className="text-gray-300 hover:text-white text-sm">Centro Recreativo Jake</Link></li>
              <li><Link to="/stay/hotel-kambutaleko" className="text-gray-300 hover:text-white text-sm">Hotel Kambutaleko</Link></li>
              <li><Link to="/stay/sansara-surf-and-yoga-resort" className="text-gray-300 hover:text-white text-sm">Sansara Resort</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Legal</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                Playa Cambutal, Panama
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                info@playacambutalguide.com
              </div>
            </div>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link to="/legal" className="text-gray-300 hover:text-white text-sm">Legal</Link></li>
              <li><Link to="/disclosure" className="text-gray-300 hover:text-white text-sm">Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Comprehensive Site Links for SEO */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-400">Popular Restaurants</h4>
              <ul className="space-y-1">
                <li><Link to="/eat/centro-recreativo-jake" className="text-xs text-gray-400 hover:text-white">Centro Recreativo Jake</Link></li>
                <li><Link to="/eat/fonda-norelis" className="text-xs text-gray-400 hover:text-white">Fonda Norelis</Link></li>
                <li><Link to="/eat/monaco-bar-and-grill" className="text-xs text-gray-400 hover:text-white">Monaco Bar and Grill</Link></li>
                <li><Link to="/eat/pizzeria-madera" className="text-xs text-gray-400 hover:text-white">Pizzeria Madera</Link></li>
                <li><Link to="/eat/kambute" className="text-xs text-gray-400 hover:text-white">Kambute</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-400">Popular Hotels</h4>
              <ul className="space-y-1">
                <li><Link to="/stay/hotel-kambutaleko" className="text-xs text-gray-400 hover:text-white">Hotel Kambutaleko</Link></li>
                <li><Link to="/stay/sansara-surf-and-yoga-resort" className="text-xs text-gray-400 hover:text-white">Sansara Surf and Yoga Resort</Link></li>
                <li><Link to="/stay/hotel-playa-cambutal" className="text-xs text-gray-400 hover:text-white">Hotel Playa Cambutal</Link></li>
                <li><Link to="/stay/stunning-beachfront-home-near-cambutal-beach-break" className="text-xs text-gray-400 hover:text-white">Beachfront Home</Link></li>
                <li><Link to="/stay/tropical-beachfront-home-in-cambutal" className="text-xs text-gray-400 hover:text-white">Tropical Beachfront Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-400">Activities</h4>
              <ul className="space-y-1">
                <li><Link to="/do/la-colectiva" className="text-xs text-gray-400 hover:text-white">La Colectiva</Link></li>
                <li><Link to="/surf" className="text-xs text-gray-400 hover:text-white">Surfing Guide</Link></li>
                <li><Link to="/do" className="text-xs text-gray-400 hover:text-white">All Activities</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Playa Cambutal Guide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
