
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, Clock, MessageCircle } from 'lucide-react';

interface AdventureBusiness {
  id: string;
  business_name: string;
  category: string;
  business_type: string;
  description: string;
  location: string | null;
  address: string | null;
  hours: string;
  whatsapp: string;
  website: string | null;
  image_url: string | null;
  created_at: string;
}

const AdventureBusinessDetail = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [business, setBusiness] = useState<AdventureBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!businessSlug) return;
      
      try {
        setIsLoading(true);
        
        console.log('Looking for business with slug:', businessSlug);
        
        // Convert slug back to business name for lookup
        const businessName = businessSlug.replace(/_/g, ' ');
        console.log('Converted slug to business name:', businessName);
        
        // First, let's get all approved businesses to see what's available
        const { data: allBusinesses, error: allError } = await supabase
          .from('adventure_business_listings')
          .select('business_name, approved')
          .eq('approved', true);
          
        if (allError) {
          console.error('Error fetching all businesses:', allError);
        } else {
          console.log('All approved businesses:', allBusinesses);
        }
        
        const { data, error } = await supabase
          .from('adventure_business_listings')
          .select('*')
          .eq('approved', true)
          .ilike('business_name', businessName)
          .single();

        if (error) {
          console.error('Error fetching business:', error);
          
          // Try a broader search to see if the business exists with a different name
          const { data: searchData, error: searchError } = await supabase
            .from('adventure_business_listings')
            .select('business_name')
            .eq('approved', true)
            .ilike('business_name', `%${businessName}%`);
            
          if (!searchError && searchData) {
            console.log('Similar business names found:', searchData);
          }
          
          setError('Business not found');
          return;
        }

        console.log('Found business:', data);
        setBusiness(data);
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to load business details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [businessSlug]);

  useEffect(() => {
    if (business) {
      document.title = `${business.business_name} - Things to Do in Cambutal`;
    }
  }, [business]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600">Loading business details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return <Navigate to="/do" replace />;
  }

  const handleWhatsAppClick = () => {
    const formattedNumber = business.whatsapp.replace(/[^\d]/g, '');
    const message = encodeURIComponent(`Hi! I'm interested in ${business.business_name}. Could you please provide more information?`);
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/do" className="hover:text-venao transition-colors">Things to Do</a>
            <span className="mx-2">›</span>
            <span>{business.business_name}</span>
          </nav>
          
          <div className="flex flex-wrap items-start gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {business.business_name}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-venao-dark/10 text-venao-dark px-3 py-1 rounded-full text-sm font-medium">
                  {business.category}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {business.business_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            {business.image_url && (
              <div className="mb-8">
                <img 
                  src={business.image_url} 
                  alt={business.business_name}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {business.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {/* Address */}
                {(business.address || business.location) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-venao-dark mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Location</p>
                      <p className="text-gray-600 text-sm">
                        {business.address || business.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-venao-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Hours</p>
                    <p className="text-gray-600 text-sm">{business.hours}</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-venao-dark mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">WhatsApp</p>
                    <Button
                      onClick={handleWhatsAppClick}
                      className="bg-green-600 hover:bg-green-700 text-white mt-2 w-full"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Website */}
                {business.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-venao-dark mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Website</p>
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-venao hover:text-venao-dark text-sm break-all"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdventureBusinessDetail;
