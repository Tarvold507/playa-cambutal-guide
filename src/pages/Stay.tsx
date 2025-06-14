import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { useHotelListings } from '@/hooks/useHotelListings';
import { updatePageHead } from '@/utils/seoUtils';
import StayHero from '../components/stay/StayHero';
import StayIntro from '../components/stay/StayIntro';
import StaySearchFilter from '../components/stay/StaySearchFilter';
import StayAccommodationGrid from '../components/stay/StayAccommodationGrid';
import StayTips from '../components/stay/StayTips';
import StayAddProperty from '../components/stay/StayAddProperty';

interface StayItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category: string;
  price?: number | null;
  rating?: number | null;
}

const Stay = () => {
  const { hotels, loading } = useHotelListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set SEO for the Stay page
    updatePageHead({
      id: 'stay-page',
      page_path: '/stay',
      page_title: 'Hotels & Accommodations in Playa Cambutal - Playa Cambutal Guide',
      meta_description: 'Find the perfect place to stay in Playa Cambutal, Panama. From luxury resorts to budget hostels, discover accommodations for every traveler.',
      meta_keywords: 'Playa Cambutal hotels, Panama accommodation, beach hotels, surf hotels, eco lodges, hostels, vacation rentals',
      og_title: 'Hotels & Accommodations in Playa Cambutal',
      og_description: 'Discover the best places to stay in Playa Cambutal, from luxury beachfront resorts to cozy eco-lodges.',
      og_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${window.location.origin}/stay`,
      robots: 'index, follow',
      schema_markup: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Hotels & Accommodations in Playa Cambutal",
        "description": "Find the perfect place to stay in Playa Cambutal, Panama. From luxury resorts to budget hostels, discover accommodations for every traveler.",
        "url": `${window.location.origin}/stay`
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }, []);

  // Transform dynamic hotels to StayItem format - now using the slug from the hook
  const dynamicItems: StayItem[] = hotels.map(hotel => ({
    id: hotel.id,
    title: hotel.name,
    description: hotel.description || 'Comfortable accommodation in Playa Cambutal.',
    imageSrc: hotel.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: `/stay/${hotel.slug}`,
    category: hotel.category,
    price: hotel.price_from,
    rating: hotel.rating
  }));

  // Filter items based on search and category
  const filteredItems = dynamicItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(dynamicItems.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading accommodations...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <StayHero />
      <StayIntro />
      <StaySearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />
      <StayAccommodationGrid filteredItems={filteredItems} />
      <StayTips />
      <StayAddProperty />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Stay;
