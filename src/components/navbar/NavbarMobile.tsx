
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';

interface NavItem {
  name: string;
  href: string;
}

interface NavbarMobileProps {
  navigation: NavItem[];
  isActive: (href: string) => boolean;
  user: any;
  isAdmin: boolean;
  t: (key: string) => string;
  signOut: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  navigation,
  isActive,
  user,
  isAdmin,
  t,
  signOut,
  isOpen,
  setIsOpen
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center space-x-2">
        <LanguageToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.profile')}
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/add-blog"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.writeBlog')}
                    </Link>
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.adminDashboard')}
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMobile;
