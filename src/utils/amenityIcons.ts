
import { 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Dumbbell, 
  Heart, 
  PawPrint, 
  AirVent, 
  UtensilsCrossed,
  Bed,
  Car as Parking,
  Phone,
  Tv,
  Wind,
  Snowflake,
  Utensils,
  Users,
  ShieldCheck,
  Shirt,
  Baby,
  Accessibility,
  Clock,
  LucideIcon
} from 'lucide-react';

export const amenityIconMap: Record<string, LucideIcon> = {
  // Accommodation & Rooms
  'Ocean View': Waves,
  'Pool': Waves,
  'Swimming Pool': Waves,
  'Beach Access': Waves,
  'Beachfront': Waves,
  'Private Beach': Waves,
  'Bed': Bed,
  'King Bed': Bed,
  'Queen Bed': Bed,
  'Twin Beds': Bed,
  
  // Technology & Connectivity
  'WiFi': Wifi,
  'Free WiFi': Wifi,
  'Internet': Wifi,
  'TV': Tv,
  'Cable TV': Tv,
  'Smart TV': Tv,
  'Phone': Phone,
  'Telephone': Phone,
  
  // Climate Control
  'Air Conditioning': Snowflake,
  'AC': Snowflake,
  'Air Conditioner': Snowflake,
  'Heating': AirVent,
  'Climate Control': AirVent,
  'Fan': Wind,
  'Ceiling Fan': Wind,
  
  // Dining & Food
  'Restaurant': Coffee,
  'Breakfast': Coffee,
  'Room Service': UtensilsCrossed,
  'Kitchen': Utensils,
  'Kitchenette': Utensils,
  'Mini Bar': Coffee,
  'Coffee': Coffee,
  'Coffee Maker': Coffee,
  'Dining': Utensils,
  
  // Wellness & Recreation
  'Spa': Heart,
  'Spa Services': Heart,
  'Massage': Heart,
  'Wellness Center': Heart,
  'Gym': Dumbbell,
  'Fitness Center': Dumbbell,
  'Fitness': Dumbbell,
  'Exercise Room': Dumbbell,
  'Yoga': Heart,
  
  // Transportation & Parking
  'Parking': Car,
  'Free Parking': Car,
  'Valet Parking': Car,
  'Garage': Car,
  'Car Rental': Car,
  'Airport Shuttle': Car,
  'Transportation': Car,
  
  // Pet & Family Services
  'Pet Friendly': PawPrint,
  'Pets Allowed': PawPrint,
  'Pet': PawPrint,
  'Pets': PawPrint,
  'Family Friendly': Users,
  'Kids Club': Baby,
  'Babysitting': Baby,
  'Child Care': Baby,
  
  // Services & Amenities
  'Laundry': Shirt,
  'Laundry Service': Shirt,
  'Laundry Facilities': Shirt,
  'Dry Cleaning': Shirt,
  'Concierge': Users,
  'Business Center': Users,
  'Meeting Room': Users,
  'Conference Room': Users,
  '24 Hour Front Desk': Clock,
  'Front Desk': Clock,
  'Reception': Clock,
  'Lockers': ShieldCheck,
  'Safe': ShieldCheck,
  'Security': ShieldCheck,
  
  // Accessibility
  'Wheelchair Accessible': Accessibility,
  'Accessible': Accessibility,
  'Disabled Access': Accessibility,
  
  // Sports & Activities
  'Surf Equipment Rental': Waves,
  'Surfboard Rental': Waves,
  'Bicycle Rental': Car,
  'Bike Rental': Car,
  'Water Sports': Waves,
  'Diving': Waves,
  'Snorkeling': Waves,
  
  // Nature & Environment
  'Eco-Friendly': Heart,
  'Solar Power': Heart,
  'Nature Trails': Heart,
  'Bird Watching': Heart,
  'Organic Garden': Heart,
  'Garden': Heart,
  'Terrace': Heart,
  'Balcony': Heart,
  
  // Default fallback
  'default': Coffee
};

export const getAmenityIcon = (amenity: string): LucideIcon => {
  // Try exact match first
  if (amenityIconMap[amenity]) {
    return amenityIconMap[amenity];
  }
  
  // Try partial matches for flexibility
  const amenityLower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIconMap)) {
    if (key.toLowerCase().includes(amenityLower) || amenityLower.includes(key.toLowerCase())) {
      return icon;
    }
  }
  
  return amenityIconMap.default;
};
