
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
    'nav.blog': 'Blog',
    'nav.info': 'Info',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.account': 'Account',
    'nav.myListings': 'My Listings',
    'nav.writeBlog': 'Write Blog Post',
    'nav.adminDashboard': 'Admin Dashboard',
    
    // Home page
    'home.title': 'Welcome to Playa Cambutal',
    'home.subtitle': 'Discover the beauty of Panama\'s Pacific coast',
    'home.exploreEat': 'Explore Restaurants',
    'home.exploreStay': 'Find Accommodations',
    'home.exploreEvents': 'Discover Events',
    'home.exploreAdventure': 'Adventure Activities',
    
    // Events
    'events.title': 'Local Events',
    'events.subtitle': 'Discover what\'s happening in Playa Cambutal',
    'events.noEvents': 'No events found.',
    'events.remindMe': 'Remind me 12 hours before this event',
    'events.viewDetails': 'View Details',
    'events.createEvent': 'Create Event',
    'events.aboutEvent': 'About this event',
    'events.details': 'Details',
    'events.hostedBy': 'Hosted by',
    
    // Restaurants
    'restaurants.title': 'Eat & Drink',
    'restaurants.subtitle': 'Discover the best restaurants and bars in Playa Cambutal',
    'restaurants.openNow': 'Show Open Now',
    'restaurants.allRestaurants': 'All Restaurants',
    'restaurants.addRestaurant': 'Add Your Restaurant',
    'restaurants.viewMenu': 'View Menu',
    'restaurants.getDirections': 'Get Directions',
    'restaurants.callNow': 'Call Now',
    'restaurants.openHours': 'Opening Hours',
    'restaurants.cuisine': 'Cuisine',
    'restaurants.priceRange': 'Price Range',
    'restaurants.rating': 'Rating',
    
    // Hotels
    'hotels.title': 'Stay',
    'hotels.subtitle': 'Find the perfect accommodation in Playa Cambutal',
    'hotels.addHotel': 'Add Your Property',
    'hotels.bookNow': 'Book Now',
    'hotels.checkAvailability': 'Check Availability',
    'hotels.amenities': 'Amenities',
    'hotels.location': 'Location',
    'hotels.rooms': 'Rooms',
    
    // Adventure
    'adventure.title': 'Adventure',
    'adventure.subtitle': 'Explore exciting activities and adventures',
    'adventure.surf': 'Surf',
    'adventure.hiking': 'Hiking',
    'adventure.fishing': 'Fishing',
    'adventure.wildlife': 'Wildlife',
    
    // Blog
    'blog.title': 'Playa Cambutal Blog',
    'blog.subtitle': 'Discover stories, tips, and insights about Panama\'s hidden paradise',
    'blog.latestStories': 'Latest Stories from Cambutal',
    'blog.readMore': 'Read More',
    'blog.noPostsYet': 'No blog posts published yet. Check back soon for exciting stories about Playa Cambutal!',
    'blog.publishedOn': 'Published on',
    'blog.by': 'by',
    
    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.required': 'Required',
    'form.optional': 'Optional',
    
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
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.viewAll': 'View All',
    'common.showMore': 'Show More',
    'common.showLess': 'Show Less',
    
    // Footer
    'footer.explore': 'Explore',
    'footer.contact': 'Contact',
    'footer.description': 'Your comprehensive guide to Playa Cambutal, Panama. Discover the best places to stay, eat, surf, and enjoy in this beautiful beach destination.',
    'footer.address': 'Playa Cambutal, Los Santos, Panama',
    'footer.email': 'info@playacambutalguide.com',
    'footer.phone': '+507 123 4567',
    'footer.copyright': 'Playa Cambutal Guide. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  es: {
    // Navigation
    'nav.eat': 'Comer',
    'nav.stay': 'Alojarse',
    'nav.events': 'Eventos',
    'nav.adventure': 'Aventura',
    'nav.blog': 'Blog',
    'nav.info': 'Información',
    'nav.profile': 'Perfil',
    'nav.admin': 'Administrador',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signOut': 'Cerrar Sesión',
    'nav.account': 'Cuenta',
    'nav.myListings': 'Mis Anuncios',
    'nav.writeBlog': 'Escribir Artículo',
    'nav.adminDashboard': 'Panel de Administración',
    
    // Home page
    'home.title': 'Bienvenido a Playa Cambutal',
    'home.subtitle': 'Descubre la belleza de la costa del Pacífico de Panamá',
    'home.exploreEat': 'Explorar Restaurantes',
    'home.exploreStay': 'Encontrar Alojamiento',
    'home.exploreEvents': 'Descubrir Eventos',
    'home.exploreAdventure': 'Actividades de Aventura',
    
    // Events
    'events.title': 'Eventos Locales',
    'events.subtitle': 'Descubre qué está pasando en Playa Cambutal',
    'events.noEvents': 'No se encontraron eventos.',
    'events.remindMe': 'Recordarme 12 horas antes de este evento',
    'events.viewDetails': 'Ver Detalles',
    'events.createEvent': 'Crear Evento',
    'events.aboutEvent': 'Sobre este evento',
    'events.details': 'Detalles',
    'events.hostedBy': 'Organizado por',
    
    // Restaurants
    'restaurants.title': 'Comer y Beber',
    'restaurants.subtitle': 'Descubre los mejores restaurantes y bares en Playa Cambutal',
    'restaurants.openNow': 'Mostrar Abierto Ahora',
    'restaurants.allRestaurants': 'Todos los Restaurantes',
    'restaurants.addRestaurant': 'Agregar Tu Restaurante',
    'restaurants.viewMenu': 'Ver Menú',
    'restaurants.getDirections': 'Obtener Direcciones',
    'restaurants.callNow': 'Llamar Ahora',
    'restaurants.openHours': 'Horarios de Apertura',
    'restaurants.cuisine': 'Cocina',
    'restaurants.priceRange': 'Rango de Precios',
    'restaurants.rating': 'Calificación',
    
    // Hotels
    'hotels.title': 'Alojarse',
    'hotels.subtitle': 'Encuentra el alojamiento perfecto en Playa Cambutal',
    'hotels.addHotel': 'Agregar Tu Propiedad',
    'hotels.bookNow': 'Reservar Ahora',
    'hotels.checkAvailability': 'Verificar Disponibilidad',
    'hotels.amenities': 'Comodidades',
    'hotels.location': 'Ubicación',
    'hotels.rooms': 'Habitaciones',
    
    // Adventure
    'adventure.title': 'Aventura',
    'adventure.subtitle': 'Explora actividades emocionantes y aventuras',
    'adventure.surf': 'Surf',
    'adventure.hiking': 'Senderismo',
    'adventure.fishing': 'Pesca',
    'adventure.wildlife': 'Vida Silvestre',
    
    // Blog
    'blog.title': 'Blog de Playa Cambutal',
    'blog.subtitle': 'Descubre historias, consejos e ideas sobre el paraíso escondido de Panamá',
    'blog.latestStories': 'Últimas Historias de Cambutal',
    'blog.readMore': 'Leer Más',
    'blog.noPostsYet': '¡Aún no se han publicado artículos de blog. Vuelve pronto para historias emocionantes sobre Playa Cambutal!',
    'blog.publishedOn': 'Publicado el',
    'blog.by': 'por',
    
    // Forms
    'form.name': 'Nombre',
    'form.email': 'Correo Electrónico',
    'form.phone': 'Teléfono',
    'form.message': 'Mensaje',
    'form.submit': 'Enviar',
    'form.cancel': 'Cancelar',
    'form.save': 'Guardar',
    'form.required': 'Requerido',
    'form.optional': 'Opcional',
    
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
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.viewAll': 'Ver Todo',
    'common.showMore': 'Mostrar Más',
    'common.showLess': 'Mostrar Menos',
    
    // Footer
    'footer.explore': 'Explorar',
    'footer.contact': 'Contacto',
    'footer.description': 'Tu guía completa de Playa Cambutal, Panamá. Descubre los mejores lugares para alojarse, comer, surfear y disfrutar en este hermoso destino de playa.',
    'footer.address': 'Playa Cambutal, Los Santos, Panamá',
    'footer.email': 'info@playacambutalguide.com',
    'footer.phone': '+507 123 4567',
    'footer.copyright': 'Guía de Playa Cambutal. Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
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
