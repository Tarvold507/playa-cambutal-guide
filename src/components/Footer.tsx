
import { Facebook, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white hover:text-primary transition-colors">
              Playa Cambutal
            </Link>
            <p className="mt-4 text-gray-400">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://www.facebook.com/61576766530599" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/playacambutalguide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="mailto:info@playacambutal.com" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.explore')}</h3>
            <ul className="space-y-2">
              {[
                { key: 'nav.eat', path: '/eat' },
                { key: 'nav.stay', path: '/stay' },
                { key: 'calendar', path: '/calendar' },
                { key: 'nav.do', path: '/do' },
                { key: 'nav.info', path: '/info' }
              ].map((item) => (
                <li key={item.key}>
                  <Link 
                    to={item.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t('footer.address')}</li>
              <li>{t('footer.email')}</li>
              <li>{t('footer.phone')}</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400 text-center">
          <p>&copy; {currentYear} {t('footer.copyright')}</p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
