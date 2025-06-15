
-- Create translations table for managing dynamic translations
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'es')),
  value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(translation_key, language)
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for translations
CREATE POLICY "Anyone can view translations" 
  ON public.translations 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Admins can insert translations" 
  ON public.translations 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update translations" 
  ON public.translations 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete translations" 
  ON public.translations 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updating updated_at
CREATE OR REPLACE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial translations for the home page explore section
INSERT INTO public.translations (translation_key, language, value, category) VALUES
  ('home.explore.title', 'en', 'Explore Playa Cambutal, Panama', 'home'),
  ('home.explore.title', 'es', 'Explora Playa Cambutal, Panamá', 'home'),
  ('home.explore.description', 'en', 'Discover the best places to stay, eat, and play in this hidden paradise', 'home'),
  ('home.explore.description', 'es', 'Descubre los mejores lugares para hospedarte, comer y jugar en este paraíso escondido', 'home'),
  ('home.cards.hotels.title', 'en', 'Boutique Hotels', 'home'),
  ('home.cards.hotels.title', 'es', 'Hoteles Boutique', 'home'),
  ('home.cards.hotels.description', 'en', 'Charming accommodations with ocean views', 'home'),
  ('home.cards.hotels.description', 'es', 'Alojamientos encantadores con vistas al océano', 'home'),
  ('home.cards.restaurants.title', 'en', 'Local Cuisine', 'home'),
  ('home.cards.restaurants.title', 'es', 'Cocina Local', 'home'),
  ('home.cards.restaurants.description', 'en', 'Fresh seafood and traditional flavors', 'home'),
  ('home.cards.restaurants.description', 'es', 'Mariscos frescos y sabores tradicionales', 'home'),
  ('home.cards.surf.title', 'en', 'World-Class Surf', 'home'),
  ('home.cards.surf.title', 'es', 'Surf de Clase Mundial', 'home'),
  ('home.cards.surf.description', 'en', 'Perfect waves for all skill levels', 'home'),
  ('home.cards.surf.description', 'es', 'Olas perfectas para todos los niveles', 'home'),
  ('home.cards.yoga.title', 'en', 'Yoga & Wellness', 'home'),
  ('home.cards.yoga.title', 'es', 'Yoga y Bienestar', 'home'),
  ('home.cards.yoga.description', 'en', 'Find your zen in paradise', 'home'),
  ('home.cards.yoga.description', 'es', 'Encuentra tu zen en el paraíso', 'home'),
  ('home.cards.wildlife.title', 'en', 'Wildlife Adventures', 'home'),
  ('home.cards.wildlife.title', 'es', 'Aventuras de Vida Silvestre', 'home'),
  ('home.cards.wildlife.description', 'en', 'Explore diverse ecosystems', 'home'),
  ('home.cards.wildlife.description', 'es', 'Explora ecosistemas diversos', 'home'),
  ('home.cards.transport.title', 'en', 'Getting Around', 'home'),
  ('home.cards.transport.title', 'es', 'Cómo Moverse', 'home'),
  ('home.cards.transport.description', 'en', 'Transportation options and tips', 'home'),
  ('home.cards.transport.description', 'es', 'Opciones de transporte y consejos', 'home');
