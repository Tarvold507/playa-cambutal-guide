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
    
    // Home page specific translations
    'home.hero.title': 'Discover Playa Cambutal, Panama',
    'home.hero.subtitle': 'Your ultimate guide to Panama\'s hidden beach paradise on the Azuero Peninsula',
    'home.intro.title': 'Welcome to Playa Cambutal, Panama',
    'home.intro.paragraph1': 'Nestled on Panama\'s Pacific coast in the Los Santos Province, Playa Cambutal is a horseshoe-shaped bay known for its consistent surf waves, stunning sunsets, and laid-back atmosphere. Located on the Azuero Peninsula, this hidden gem has evolved from a secret surf spot into Panama\'s beloved destination for travelers seeking authentic beach experiences and world-class surfing.',
    'home.intro.paragraph2': 'Cambutal, Panama offers year-round warm weather, making it perfect for surfing, beach activities, and exploring the rich culture of rural Panama. Whether you\'re planning your first visit to this Pacific coast paradise or returning to experience more of what Playa Cambutal has to offer, our comprehensive guide provides everything you need for an unforgettable Panama vacation.',
    'home.intro.paragraph3': 'Discover why Playa Cambutal is becoming Panama\'s most sought-after beach destination for surfers, families, and adventure seekers from around the world. From the best surf breaks to authentic Panamanian cuisine, eco-friendly accommodations to thrilling wildlife tours - your perfect Cambutal experience awaits.',
    'home.explore.title': 'Explore Playa Cambutal, Panama',
    'home.explore.description': 'Discover the best places to eat, stay, surf, and explore in Panama\'s premier beach destination.',
    'home.featured.surf.title': 'Perfect Surf Waves Year Round in Panama',
    'home.featured.surf.description': 'Playa Cambutal offers some of Panama\'s most consistent surf conditions throughout the year, making it an ideal destination for surfers of all levels. With a variety of breaks and waves ranging from gentle rollers to powerful point breaks, Cambutal has something for everyone. Local surf schools provide professional lessons and equipment rentals for beginners, while experienced surfers can find challenging waves, especially during Panama\'s prime swell season from March to November.',
    'home.featured.surf.linkText': 'Learn more about surfing in Cambutal',
    'home.featured.cuisine.title': 'Authentic Panama Culinary Experience',
    'home.featured.cuisine.description': 'From beachfront seafood restaurants to upscale international dining, Playa Cambutal\'s food scene showcases the best of Panama\'s culinary diversity. Experience fresh-caught Pacific fish, traditional Panamanian dishes, wood-fired pizzas, and farm-to-table organic offerings. Many Cambutal restaurants source ingredients locally from the fertile Azuero Peninsula, and vegetarian and vegan options reflect Panama\'s growing sustainability movement. Don\'t miss trying local Panamanian specialties like ceviche and patacones while watching spectacular Pacific sunsets.',
    'home.featured.cuisine.linkText': 'Discover Cambutal restaurants',
    
    // Card items
    'home.cards.hotels.title': 'Beautiful Beachfront Hotels',
    'home.cards.hotels.description': 'Wake up to the sound of waves with our selection of beachfront accommodations in Playa Cambutal.',
    'home.cards.restaurants.title': 'Local & International Cuisine',
    'home.cards.restaurants.description': 'Explore a diverse array of restaurants and cafes offering everything from local delicacies to international favorites.',
    'home.cards.surf.title': 'Catch the Perfect Wave',
    'home.cards.surf.description': 'Playa Cambutal is famous for its consistent waves, making it a paradise for surfers of all levels.',
    'home.cards.yoga.title': 'Yoga & Wellness',
    'home.cards.yoga.description': 'Find your zen with beachfront yoga classes and wellness activities for mind and body rejuvenation.',
    'home.cards.wildlife.title': 'Wildlife Excursions',
    'home.cards.wildlife.description': 'Discover the rich biodiversity of Panama with guided tours to see monkeys, birds, and marine life.',
    'home.cards.transport.title': 'Transportation Options',
    'home.cards.transport.description': 'Find the best ways to get to and around Playa Cambutal, from airport shuttles to local taxis.',
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
    
    // Home page specific translations
    'home.hero.title': 'Descubre Playa Cambutal, Panamá',
    'home.hero.subtitle': 'Tu guía definitiva al paraíso playero escondido de Panamá en la Península de Azuero',
    'home.intro.title': 'Bienvenido a Playa Cambutal, Panamá',
    'home.intro.paragraph1': 'Ubicada en la costa del Pacífico de Panamá en la Provincia de Los Santos, Playa Cambutal es una bahía en forma de herradura conocida por sus olas de surf consistentes, atardeceres impresionantes y ambiente relajado. Ubicada en la Península de Azuero, esta joya escondida ha evolucionado de un lugar secreto de surf a destino querido de Panamá para viajeros que buscan experiencias auténticas de playa y surf de clase mundial.',
    'home.intro.paragraph2': 'Cambutal, Panamá ofrece clima cálido durante todo el año, lo que lo hace perfecto para surfear, actividades de playa y explorar la rica cultura del Panamá rural. Ya sea que estés planeando tu primera visita a este paraíso de la costa del Pacífico o regresando para experimentar más de lo que Playa Cambutal tiene para ofrecer, nuestra guía completa proporciona todo lo que necesitas para unas vacaciones inolvidables en Panamá.',
    'home.intro.paragraph3': 'Descubre por qué Playa Cambutal se está convirtiendo en el destino playero más buscado de Panamá para surfistas, familias y buscadores de aventuras de todo el mundo. Desde los mejores puntos de surf hasta la auténtica cocina panameña, alojamientos ecológicos hasta emocionantes tours de vida silvestre - tu experiencia perfecta en Cambutal te espera.',
    'home.explore.title': 'Explora Playa Cambutal, Panamá',
    'home.explore.description': 'Descubre los mejores lugares para comer, alojarse, surfear y explorar en el destino playero premier de Panamá.',
    'home.featured.surf.title': 'Olas de Surf Perfectas Todo el Año en Panamá',
    'home.featured.surf.description': 'Playa Cambutal ofrece algunas de las condiciones de surf más consistentes de Panamá durante todo el año, lo que la convierte en un destino ideal para surfistas de todos los niveles. Con una variedad de rompientes y olas que van desde rodillos suaves hasta point breaks poderosos, Cambutal tiene algo para todos. Las escuelas de surf locales proporcionan lecciones profesionales y alquiler de equipos para principiantes, mientras que los surfistas experimentados pueden encontrar olas desafiantes, especialmente durante la temporada de oleaje principal de Panamá de marzo a noviembre.',
    'home.featured.surf.linkText': 'Aprende más sobre el surf en Cambutal',
    'home.featured.cuisine.title': 'Experiencia Culinaria Auténtica de Panamá',
    'home.featured.cuisine.description': 'Desde restaurantes de mariscos frente a la playa hasta cenas internacionales de lujo, la escena gastronómica de Playa Cambutal muestra lo mejor de la diversidad culinaria de Panamá. Experimenta pescado fresco del Pacífico, platos tradicionales panameños, pizzas al horno de leña y ofertas orgánicas de la granja a la mesa. Muchos restaurantes de Cambutal obtienen ingredientes localmente de la fértil Península de Azuero, y las opciones vegetarianas y veganas reflejan el creciente movimiento de sostenibilidad de Panamá. No te pierdas probar especialidades panameñas locales como ceviche y patacones mientras observas espectaculares atardeceres del Pacífico.',
    'home.featured.cuisine.linkText': 'Descubre restaurantes de Cambutal',
    
    // Card items
    'home.cards.hotels.title': 'Hermosos Hoteles Frente al Mar',
    'home.cards.hotels.description': 'Despierta con el sonido de las olas con nuestra selección de alojamientos frente a la playa en Playa Cambutal.',
    'home.cards.restaurants.title': 'Cocina Local e Internacional',
    'home.cards.restaurants.description': 'Explora una variedad diversa de restaurantes y cafés que ofrecen todo, desde delicias locales hasta favoritos internacionales.',
    'home.cards.surf.title': 'Atrapa la Ola Perfecta',
    'home.cards.surf.description': 'Playa Cambutal es famosa por sus olas consistentes, convirtiéndola en un paraíso para surfistas de todos los niveles.',
    'home.cards.yoga.title': 'Yoga y Bienestar',
    'home.cards.yoga.description': 'Encuentra tu zen con clases de yoga frente a la playa y actividades de bienestar para la rejuvenecimiento de mente y cuerpo.',
    'home.cards.wildlife.title': 'Excursiones de Vida Silvestre',
    'home.cards.wildlife.description': 'Descubre la rica biodiversidad de Panamá con tours guiados para ver monos, aves y vida marina.',
    'home.cards.transport.title': 'Opciones de Transporte',
    'home.cards.transport.description': 'Encuentra las mejores maneras de llegar y moverse por Playa Cambutal, desde shuttles del aeropuerto hasta taxis locales.',
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
