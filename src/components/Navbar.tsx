
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import NavbarDesktop from './navbar/NavbarDesktop';
import NavbarMobile from './navbar/NavbarMobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();
  const location = useLocation();

  const navigation = [
    { name: t('nav.eat'), href: '/eat' },
    { name: t('nav.stay'), href: '/stay' },
    { name: 'Do', href: '/do' },
    { name: 'Calendar', href: '/calendar' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.info'), href: '/info' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Playa Cambutal</span>
            </Link>
          </div>

          <NavbarDesktop
            navigation={navigation}
            isActive={isActive}
            user={user}
            isAdmin={isAdmin}
            t={t}
            signOut={signOut}
          />

          <NavbarMobile
            navigation={navigation}
            isActive={isActive}
            user={user}
            isAdmin={isAdmin}
            t={t}
            signOut={signOut}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
