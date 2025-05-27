
export interface Restaurant {
  name: string;
  category: string;
  imageSrc: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  hours: Record<string, string>;
  images: string[];
  menuImages: string[];
}

export const restaurantData: Record<string, Restaurant> = {
  'beachfront_grill': {
    name: 'Beachfront Grill',
    category: 'Seafood',
    imageSrc: 'https://images.unsplash.com/photo-1619738566066-81c4559aba52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    description: 'Enjoy fresh seafood and grilled specialties with your toes in the sand at this casual beachfront eatery. Our menu features locally caught fish, grilled meats, and tropical cocktails, all served with stunning ocean views.',
    address: 'Playa Cambutal Beachfront',
    phone: '+507 6234-5678',
    website: 'https://beachfrontgrill.com',
    whatsapp: '+50762345678',
    hours: {
      'Monday': '11:00 AM - 10:00 PM',
      'Tuesday': '11:00 AM - 10:00 PM',
      'Wednesday': '11:00 AM - 10:00 PM',
      'Thursday': '11:00 AM - 10:00 PM',
      'Friday': '11:00 AM - 11:00 PM',
      'Saturday': '11:00 AM - 11:00 PM',
      'Sunday': '11:00 AM - 10:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  'jungle_cafe': {
    name: 'Jungle Cafe',
    category: 'Cafe',
    imageSrc: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    description: 'A cozy spot offering organic breakfasts, smoothie bowls, and gourmet coffee in a lush garden setting. Perfect for starting your day with healthy, delicious options in a peaceful tropical environment.',
    address: 'Main Road, Cambutal',
    phone: '+507 6234-5679',
    whatsapp: '+50762345679',
    hours: {
      'Monday': '7:00 AM - 3:00 PM',
      'Tuesday': '7:00 AM - 3:00 PM',
      'Wednesday': '7:00 AM - 3:00 PM',
      'Thursday': '7:00 AM - 3:00 PM',
      'Friday': '7:00 AM - 3:00 PM',
      'Saturday': '7:00 AM - 4:00 PM',
      'Sunday': '7:00 AM - 4:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  'sunset_lounge': {
    name: 'Sunset Lounge',
    category: 'Bar & Tapas',
    imageSrc: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    description: 'The perfect spot to enjoy craft cocktails and tapas while watching Cambutal\'s famous sunsets. Our elevated terrace offers panoramic ocean views and a sophisticated atmosphere.',
    address: 'Sunset Point, Cambutal',
    phone: '+507 6234-5680',
    website: 'https://sunsetlounge.com',
    whatsapp: '+50762345680',
    hours: {
      'Monday': 'Closed',
      'Tuesday': '5:00 PM - 12:00 AM',
      'Wednesday': '5:00 PM - 12:00 AM',
      'Thursday': '5:00 PM - 12:00 AM',
      'Friday': '5:00 PM - 1:00 AM',
      'Saturday': '5:00 PM - 1:00 AM',
      'Sunday': '5:00 PM - 11:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  'pizzeria_cambutal': {
    name: 'Pizzeria Cambutal',
    category: 'Italian',
    imageSrc: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    description: 'Wood-fired pizzas with creative toppings, made with local and imported ingredients. Our authentic Italian recipes combined with fresh local produce create unforgettable flavors.',
    address: 'Centro, Cambutal',
    phone: '+507 6234-5681',
    whatsapp: '+50762345681',
    hours: {
      'Monday': '12:00 PM - 11:00 PM',
      'Tuesday': '12:00 PM - 11:00 PM',
      'Wednesday': '12:00 PM - 11:00 PM',
      'Thursday': '12:00 PM - 11:00 PM',
      'Friday': '12:00 PM - 12:00 AM',
      'Saturday': '12:00 PM - 12:00 AM',
      'Sunday': '12:00 PM - 11:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548369937-47519962c11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  'sushi_paradise': {
    name: 'Sushi Paradise',
    category: 'Japanese',
    imageSrc: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    description: 'Fresh sushi and Japanese-inspired dishes using locally caught fish and imported specialties. Experience authentic Japanese cuisine with a tropical twist.',
    address: 'Coastal Road, Cambutal',
    phone: '+507 6234-5682',
    whatsapp: '+50762345682',
    hours: {
      'Monday': 'Closed',
      'Tuesday': '6:00 PM - 11:00 PM',
      'Wednesday': '6:00 PM - 11:00 PM',
      'Thursday': '6:00 PM - 11:00 PM',
      'Friday': '6:00 PM - 12:00 AM',
      'Saturday': '6:00 PM - 12:00 AM',
      'Sunday': '6:00 PM - 11:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564767655658-4e6b365935b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  'local_comedor': {
    name: 'Local Comedor',
    category: 'Panamanian',
    imageSrc: 'https://images.unsplash.com/photo-1628519592419-bf1b8fb630cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    description: 'Experience authentic Panamanian home cooking at this family-run restaurant offering daily specials. Traditional recipes passed down through generations, made with love and local ingredients.',
    address: 'Village Center, Cambutal',
    phone: '+507 6234-5683',
    whatsapp: '+50762345683',
    hours: {
      'Monday': '11:00 AM - 9:00 PM',
      'Tuesday': '11:00 AM - 9:00 PM',
      'Wednesday': '11:00 AM - 9:00 PM',
      'Thursday': '11:00 AM - 9:00 PM',
      'Friday': '11:00 AM - 10:00 PM',
      'Saturday': '11:00 AM - 10:00 PM',
      'Sunday': '11:00 AM - 9:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1568096889942-6eedde686635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628519592419-bf1b8fb630cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  }
};
