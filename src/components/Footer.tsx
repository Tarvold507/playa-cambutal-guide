
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
