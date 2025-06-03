
export interface EditFormData {
  type?: 'event' | 'business' | 'restaurant' | 'hotel' | 'blog';
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
  // Blog specific fields
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  tags?: string[];
  status?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  published_at?: string;
  [key: string]: any;
}

export type TableType = 'events' | 'business_listings' | 'restaurant_listings' | 'hotel_listings' | 'blog_posts';
export type ItemType = 'event' | 'business' | 'restaurant' | 'hotel' | 'blog';
