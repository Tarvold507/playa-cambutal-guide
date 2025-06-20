
export interface PageSEO {
  id: string;
  page_path: string;
  page_title: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots?: string;
  schema_markup?: any;
  created_at: string;
  updated_at: string;
}
