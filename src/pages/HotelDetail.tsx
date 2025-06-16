import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageGallery from '../components/ImageGallery';
import HotelMap from '../components/HotelMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHotelDetails } from '@/hooks/useHotelListings';
import { useHotelSEO } from '@/hooks/useHotelSEO';
import { getAmenityIcon } from '@/utils/amenityIcons';

const HotelDetail = () => {
  const { hotelSlug } = useParams();
  const navigate = useNavigate();
  const { hotel, loading } = useHotelDetails(hotelSlug || '');

  // Apply SEO data for this hotel
  useHotelSEO(hotel);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading hotel details...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel not found</h1>
          <Button onClick={() => navigate('/stay')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stay
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const trackAffiliateClick = () => {
    console.log('Affiliate link clicked:', hotel.affiliate_url);
    // Here you could add analytics tracking
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/stay')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stay
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                {hotel.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{hotel.rating}</span>
                    {hotel.review_count > 0 && (
                      <span className="text-sm">({hotel.review_count} reviews)</span>
                    )}
                  </div>
                )}
                <Badge variant="secondary">{hotel.category}</Badge>
              </div>
            </div>
            
            <div className="text-right">
              {hotel.price_from && (
                <div className="text-2xl font-bold text-venao-dark">
                  From ${hotel.price_from}
                  <span className="text-sm font-normal text-gray-600">/night</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <ImageGallery 
            images={hotel.gallery_images.length > 0 ? hotel.gallery_images : hotel.image_url ? [hotel.image_url] : []}
            title={hotel.name}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {hotel.full_description || hotel.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {hotel.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-venao-dark" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Policies */}
            {Object.keys(hotel.policies).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(hotel.policies).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace('_', ' ')}
                        </h4>
                        <p className="text-gray-600">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.price_from && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-venao-dark">
                      ${hotel.price_from}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-venao-dark hover:bg-venao-dark/90"
                  size="lg"
                  onClick={trackAffiliateClick}
                  asChild
                >
                  <a 
                    href={hotel.affiliate_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Book Now on Expedia
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  You'll be redirected to Expedia to complete your booking
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <HotelMap
                  latitude={hotel.latitude}
                  longitude={hotel.longitude}
                  name={hotel.name}
                  address={hotel.address}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HotelDetail;
