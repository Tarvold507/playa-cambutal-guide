
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Plus } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';

interface NavItem {
  name: string;
  href: string;
}

interface NavbarDesktopProps {
  navigation: NavItem[];
  isActive: (href: string) => boolean;
  user: any;
  isAdmin: boolean;
  t: (key: string) => string;
  signOut: () => void;
}

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  navigation,
  isActive,
  user,
  isAdmin,
  t,
  signOut
}) => {
  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right side items */}
      <div className="hidden md:flex items-center space-x-4">
        <LanguageToggle />
        
        {user ? (
          <>
            {isAdmin && (
              <Link 
                to="/admin"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              >
                {t('nav.admin')}
              </Link>
            )}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{t('nav.account')}</span>
              </Button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('nav.profile')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/add-blog"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('nav.writeBlog')}
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link 
            to="/auth"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
          >
            {t('nav.signIn')}
          </Link>
        )}
      </div>
    </>
  );
};

export default NavbarDesktop;
