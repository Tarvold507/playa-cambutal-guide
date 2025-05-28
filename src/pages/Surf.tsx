
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import { Button } from '@/components/ui/button';
import { Plus, Clock, MessageCircle, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SurfBusiness {
  id: string;
  name: string;
  type: string;
  description: string;
  hours: string;
  whatsapp: string;
  location?: string;
}

const placeholderBusinesses: SurfBusiness[] = [
  {
    id: '1',
    name: 'Cambutal Surf Academy',
    type: 'Lessons',
    description: 'Professional surf instruction for all levels. Our certified instructors will have you catching waves in no time with personalized lessons and equipment included.',
    hours: 'Daily 6:00 AM - 6:00 PM',
    whatsapp: '+507-6123-4567',
    location: 'Main Beach'
  },
  {
    id: '2',
    name: 'Pacific Wave Rentals',
    type: 'Rentals',
    description: 'Premium surfboard and equipment rentals. We stock the latest boards from top brands, plus wetsuits, leashes, and all the gear you need.',
    hours: 'Daily 7:00 AM - 5:00 PM',
    whatsapp: '+507-6234-5678',
    location: 'Beach Road'
  },
  {
    id: '3',
    name: 'Cambutal Surf Shop',
    type: 'Shop',
    description: 'Your one-stop surf shop featuring boards, apparel, accessories, and local surf art. We carry international brands and support local shapers.',
    hours: 'Mon-Sat 8:00 AM - 6:00 PM, Sun 9:00 AM - 4:00 PM',
    whatsapp: '+507-6345-6789',
    location: 'Village Center'
  },
  {
    id: '4',
    name: 'Ding Repair Panama',
    type: 'Repair',
    description: 'Expert surfboard repair services. Quick turnaround on dings, cracks, and custom modifications. We also do board shaping and fin installations.',
    hours: 'Mon-Fri 8:00 AM - 4:00 PM',
    whatsapp: '+507-6456-7890',
    location: 'Workshop near beach'
  },
  {
    id: '5',
    name: 'Sunset Surf School',
    type: 'Lessons',
    description: 'Group and private surf lessons with a focus on ocean safety and sustainable surfing practices. Perfect for families and beginners.',
    hours: 'Daily 7:00 AM - 5:00 PM',
    whatsapp: '+507-6567-8901',
    location: 'South Beach'
  },
  {
    id: '6',
    name: 'Azuero Board Works',
    type: 'Shop',
    description: 'Custom surfboard shaping and high-end surf equipment. We create boards tailored to local conditions and your surfing style.',
    hours: 'Tue-Sat 9:00 AM - 5:00 PM',
    whatsapp: '+507-6678-9012',
    location: 'Artisan Quarter'
  }
];

interface SurfBusinessItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category?: string;
}

const Surf = () => {
  const [surfBusinesses, setSurfBusinesses] = useState<SurfBusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSurfBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('business_listings')
        .select('*')
        .eq('approved', true)
        .ilike('category', '%surf%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const businesses: SurfBusinessItem[] = data?.map(business => ({
        id: business.id,
        title: business.name,
        description: business.description || 'Professional surf services in Playa Cambutal.',
        imageSrc: business.image_url || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        link: `/business/${business.id}`,
        category: business.category
      })) || [];

      setSurfBusinesses(businesses);
    } catch (error) {
      console.error('Error fetching surf businesses:', error);
      toast({
        title: "Error",
        description: "Failed to load surf businesses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSurfBusinesses();
  }, []);

  const getWhatsAppUrl = (number: string) => {
    const cleanNumber = number.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lessons':
        return 'bg-blue-100 text-blue-800';
      case 'rentals':
        return 'bg-green-100 text-green-800';
      case 'shop':
        return 'bg-purple-100 text-purple-800';
      case 'repair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Surf Paradise"
        subtitle="Catch the perfect wave in Playa Cambutal - Panama's premier surf destination"
        imageSrc="https://images.unsplash.com/photo-1530684585734-6979140f1d82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">World-Class Surfing in Panama</h2>
          <div className="text-gray-600 space-y-4 text-lg leading-relaxed">
            <p>
              Playa Cambutal is renowned as one of Panama's premier surf destinations, offering consistent waves 
              and versatile surf conditions year-round. The beach's unique horseshoe shape creates multiple breaks 
              suitable for surfers of all skill levels, from gentle rollers perfect for beginners to powerful 
              point breaks that challenge even the most experienced riders.
            </p>
            <p>
              Located on the Azuero Peninsula's Pacific coast, Cambutal benefits from consistent south and southwest 
              swells, with the best conditions typically occurring during the dry season (December-April) when 
              offshore winds groom the waves to perfection. The warm water temperature year-round means you can 
              surf comfortably in just board shorts or a spring suit.
            </p>
            <p>
              Whether you're taking your first surf lesson or searching for that perfect barrel, Playa Cambutal's 
              welcoming surf community and professional services ensure an unforgettable experience in one of 
              Central America's most beautiful coastal settings.
            </p>
          </div>
        </div>
      </section>

      {/* Surf Business Listings */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Surf Services & Businesses</h2>
            <p className="text-gray-600">Professional surf instruction, rentals, and services from local experts in Playa Cambutal.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderBusinesses.map(business => (
              <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{business.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(business.type)}`}>
                      {business.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{business.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {business.hours}
                    </div>
                    {business.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {business.location}
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={getWhatsAppUrl(business.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Database Business Listings */}
      {surfBusinesses.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Surf Businesses</h2>
              <p className="text-gray-600">Additional surf services from our business directory.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {surfBusinesses.map(item => (
                <a
                  key={item.id}
                  href={item.link}
                  className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.imageSrc} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.category && (
                      <div className="absolute top-4 left-4 bg-venao-dark/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-venao transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add Business Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Offer Surf Services in Cambutal?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our directory and connect with surfers visiting Playa Cambutal! Whether you offer lessons, 
            rentals, repairs, or other surf-related services, showcase your business to our community.
          </p>
          <Button 
            onClick={() => navigate('/add-business')}
            size="lg"
            className="bg-venao-dark hover:bg-venao-dark/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            List Your Surf Business
          </Button>
          {!user && (
            <p className="text-sm text-gray-500 mt-2">
              You'll need to sign in to add a business listing.
            </p>
          )}
        </div>
      </section>

      {/* Wave Forecast Widget */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Current Wave Forecast</h2>
            <div className="surf-forecast-widget">
              <link href="//www.surf-forecast.com/stylesheets/widget.css" media="screen" rel="stylesheet" type="text/css" />
              <div className="wf-width-cont surf-fc-widget widget-centered">
                <div className="widget-container">
                  <div className="external-cont">
                    <iframe 
                      className="surf-fc-i" 
                      allowTransparency={true}
                      src="//www.surf-forecast.com/breaks/Cambutal/forecasts/widget/a" 
                      scrolling="no" 
                      frameBorder={0}
                      marginWidth={0}
                      marginHeight={0}
                      style={{ width: '100%', height: '400px' }}
                    />
                    <div className="footer">
                      <a className="logo" href="//www.surf-forecast.com/">
                        <img src="//www.surf-forecast.com/images/widget.png" width={1} height={1} alt="Surf Forecast" />
                      </a>
                      <div className="about" id="cmt">
                        More <a href="//www.surf-forecast.com/breaks/Cambutal">Detailed Surf Conditions &amp; Webcams for&nbsp;Playa Cambutal</a> <span>at&nbsp;<a href="//www.surf-forecast.com/">surf-forecast.com</a></span>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Surf;
