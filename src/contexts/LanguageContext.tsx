
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.eat': 'Eat',
    'nav.stay': 'Stay',
    'nav.events': 'Events',
    'nav.adventure': 'Adventure',
    'nav.info': 'Info',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Dashboard',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    
    // Home page
    'home.title': 'Welcome to Playa Cambutal',
    'home.subtitle': 'Discover the beauty of Panama\'s Pacific coast',
    
    // Events
    'events.title': 'Events',
    'events.noEvents': 'No events found.',
    'events.remindMe': 'Remind me before this event',
    'events.viewDetails': 'View Details',
    'events.createEvent': 'Create Event',
    
    // Restaurants
    'restaurants.openNow': 'Show Open Now',
    'restaurants.allRestaurants': 'All Restaurants',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.pendingEvents': 'Pending Events',
    'admin.pendingBusinesses': 'Pending Businesses',
    'admin.approve': 'Approve',
    'admin.edit': 'Edit',
    'admin.reject': 'Reject',
    'admin.noEvents': 'No pending events to review.',
    'admin.noBusinesses': 'No pending business listings to review.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.submit': 'Submit',
  },
  es: {
    // Navigation
    'nav.eat': 'Comer',
    'nav.stay': 'Alojarse',
    'nav.events': 'Eventos',
    'nav.adventure': 'Aventura',
    'nav.info': 'Información',
    'nav.profile': 'Perfil',
    'nav.admin': 'Panel de Administración',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signOut': 'Cerrar Sesión',
    
    // Home page
    'home.title': 'Bienvenido a Playa Cambutal',
    'home.subtitle': 'Descubre la belleza de la costa del Pacífico de Panamá',
    
    // Events
    'events.title': 'Eventos',
    'events.noEvents': 'No se encontraron eventos.',
    'events.remindMe': 'Recordarme antes de este evento',
    'events.viewDetails': 'Ver Detalles',
    'events.createEvent': 'Crear Evento',
    
    // Restaurants
    'restaurants.openNow': 'Mostrar Abierto Ahora',
    'restaurants.allRestaurants': 'Todos los Restaurantes',
    
    // Admin
    'admin.title': 'Panel de Administración',
    'admin.pendingEvents': 'Eventos Pendientes',
    'admin.pendingBusinesses': 'Negocios Pendientes',
    'admin.approve': 'Aprobar',
    'admin.edit': 'Editar',
    'admin.reject': 'Rechazar',
    'admin.noEvents': 'No hay eventos pendientes para revisar.',
    'admin.noBusinesses': 'No hay listados de negocios pendientes para revisar.',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.submit': 'Enviar',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
