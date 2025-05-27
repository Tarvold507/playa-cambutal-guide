
export interface EditFormData {
  type?: 'event' | 'business' | 'restaurant' | 'hotel';
  id?: string;
  title?: string;
  location?: string;
  host?: string;
  description?: string;
  name?: string;
  category?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  image_url?: string;
  hours?: Record<string, string>;
  gallery_images?: string[];
  menu_images?: string[];
  amenities?: string[];
  affiliate_url?: string;
  expedia_hotel_id?: string;
  price_from?: number;
  commission_rate?: number;
  policies?: Record<string, any>;
  [key: string]: any;
}

export type TableType = 'events' | 'business_listings' | 'restaurant_listings' | 'hotel_listings';
export type ItemType = 'event' | 'business' | 'restaurant' | 'hotel';
