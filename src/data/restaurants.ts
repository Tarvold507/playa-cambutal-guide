
export interface RestaurantHours {
  [key: string]: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  category: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  hours: RestaurantHours;
  images: string[];
  menuImages: string[];
  openNow?: boolean;
}

export const restaurantData: { [key: string]: Restaurant } = {
  'beachfront-grill': {
    id: 'beachfront-grill',
    name: 'Beachfront Grill',
    description: 'Enjoy fresh seafood and grilled specialties with your toes in the sand at this casual beachfront eatery. Our menu features locally caught fish, tropical cocktails, and international favorites.',
    imageSrc: 'https://images.unsplash.com/photo-1619738566066-81c4559aba52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Seafood',
    phone: '+507 6123-4567',
    whatsapp: '+5076123567',
    website: 'https://example.com',
    address: 'Playa Cambutal, Azuero Peninsula, Panama',
    hours: {
      Monday: '11:00 AM - 10:00 PM',
      Tuesday: '11:00 AM - 10:00 PM',
      Wednesday: '11:00 AM - 10:00 PM',
      Thursday: '11:00 AM - 10:00 PM',
      Friday: '11:00 AM - 11:00 PM',
      Saturday: '11:00 AM - 11:00 PM',
      Sunday: '11:00 AM - 10:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1619738566066-81c4559aba52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    openNow: true
  },
  'jungle-cafe': {
    id: 'jungle-cafe',
    name: 'Jungle Cafe',
    description: 'A cozy spot offering organic breakfasts, smoothie bowls, and gourmet coffee in a lush garden setting. We pride ourselves on using fresh, local ingredients and supporting sustainable farming practices.',
    imageSrc: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Cafe',
    phone: '+507 6234-5678',
    whatsapp: '+5076234567',
    address: 'Playa Cambutal, Azuero Peninsula, Panama',
    hours: {
      Monday: '7:00 AM - 3:00 PM',
      Tuesday: '7:00 AM - 3:00 PM',
      Wednesday: '7:00 AM - 3:00 PM',
      Thursday: '7:00 AM - 3:00 PM',
      Friday: '7:00 AM - 3:00 PM',
      Saturday: '7:00 AM - 3:00 PM',
      Sunday: '7:00 AM - 3:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    openNow: true
  },
  'sunset-lounge': {
    id: 'sunset-lounge',
    name: 'Sunset Lounge',
    description: 'The perfect spot to enjoy craft cocktails and tapas while watching Cambutal\'s famous sunsets. Our rooftop terrace offers panoramic ocean views and a sophisticated atmosphere.',
    imageSrc: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Bar & Tapas',
    phone: '+507 6345-6789',
    whatsapp: '+5076345678',
    address: 'Playa Cambutal, Azuero Peninsula, Panama',
    hours: {
      Monday: '5:00 PM - 12:00 AM',
      Tuesday: '5:00 PM - 12:00 AM',
      Wednesday: '5:00 PM - 12:00 AM',
      Thursday: '5:00 PM - 12:00 AM',
      Friday: '5:00 PM - 1:00 AM',
      Saturday: '5:00 PM - 1:00 AM',
      Sunday: '5:00 PM - 12:00 AM'
    },
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    openNow: false
  },
  'pizzeria': {
    id: 'pizzeria',
    name: 'Pizzeria Cambutal',
    description: 'Wood-fired pizzas with creative toppings, made with local and imported ingredients. Our traditional Italian wood oven creates the perfect crispy crust for our artisanal pizzas.',
    imageSrc: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Italian',
    phone: '+507 6456-7890',
    whatsapp: '+5076456789',
    address: 'Playa Cambutal, Azuero Peninsula, Panama',
    hours: {
      Monday: '12:00 PM - 11:00 PM',
      Tuesday: '12:00 PM - 11:00 PM',
      Wednesday: '12:00 PM - 11:00 PM',
      Thursday: '12:00 PM - 11:00 PM',
      Friday: '12:00 PM - 11:00 PM',
      Saturday: '12:00 PM - 11:00 PM',
      Sunday: '12:00 PM - 11:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    openNow: true
  },
  'sushi': {
    id: 'sushi',
    name: 'Sushi Paradise',
    description: 'Fresh sushi and Japanese-inspired dishes using locally caught fish and imported specialties. Our expert chefs combine traditional Japanese techniques with fresh local ingredients.',
    imageSrc: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Japanese',
    phone: '+507 6567-8901',
    whatsapp: '+5076567890',
    address: 'Playa Cambutal, Azuero Peninsula, Panama',
    hours: {
      Monday: 'Closed',
      Tuesday: '6:00 PM - 11:00 PM',
      Wednesday: '6:00 PM - 11:00 PM',
      Thursday: '6:00 PM - 11:00 PM',
      Friday: '6:00 PM - 11:00 PM',
      Saturday: '6:00 PM - 11:00 PM',
      Sunday: '6:00 PM - 11:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    openNow: false
  },
  'comedor': {
    id: 'comedor',
    name: 'Local Comedor',
    description: 'Experience authentic Panamanian home cooking at this family-run restaurant offering daily specials. Enjoy traditional dishes like sancocho, patacones, and fresh ceviche in a warm, welcoming atmosphere.',
    imageSrc: 'https://images.unsplash.com/photo-1628519592419-bf1b8fb630cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Panamanian',
    phone: '+507 6678-9012',
    whatsapp: '+5076678901',
    address: 'Playa Cambutal, Azuero Peninsula, Panama',
    hours: {
      Monday: '11:00 AM - 9:00 PM',
      Tuesday: '11:00 AM - 9:00 PM',
      Wednesday: '11:00 AM - 9:00 PM',
      Thursday: '11:00 AM - 9:00 PM',
      Friday: '11:00 AM - 9:00 PM',
      Saturday: '11:00 AM - 9:00 PM',
      Sunday: '11:00 AM - 9:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1628519592419-bf1b8fb630cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    openNow: true
  }
};
