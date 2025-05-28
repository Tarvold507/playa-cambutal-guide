
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      {surfBusinesses.length > 0 && (
        <CardSection 
          title="Surf Services & Businesses"
          description="Professional surf instruction, rentals, and services from local experts in Playa Cambutal."
          items={surfBusinesses}
          bgColor="bg-gray-50"
        />
      )}

      {/* Add Business Section */}
      <section className="bg-white py-16">
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
      
      {/* Wave Guide Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Seasonal Surf Guide</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Dry Season (December - April)</h3>
                <p className="text-gray-600 mb-4">
                  The prime surf season with consistent offshore winds and moderate-sized swells. 
                  Perfect for intermediate surfers, with occasional bigger days for experienced riders.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Wave size: 2-6 feet (occasionally larger)</li>
                  <li>• Wind: Offshore mornings, light onshore afternoons</li>
                  <li>• Water temp: 26-28°C (79-82°F)</li>
                  <li>• Crowds: Moderate to high</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Green Season (May - November)</h3>
                <p className="text-gray-600 mb-4">
                  Larger, more powerful swells arrive, especially June-August. Morning sessions 
                  are best before afternoon rains and winds affect conditions.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Wave size: 3-8 feet (can be larger)</li>
                  <li>• Wind: Variable, strongest afternoons</li>
                  <li>• Water temp: 27-29°C (81-84°F)</li>
                  <li>• Crowds: Light to moderate</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Best Surf Spots</h3>
                <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Main Beach (Beginners)</h4>
                    <p className="text-sm">Right side of the bay with gentle, forgiving waves perfect for learning.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Center Peak (Intermediate)</h4>
                    <p className="text-sm">Consistent break in the middle of the bay with left and right options.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Point Break (Advanced)</h4>
                    <p className="text-sm">Left side point break offering longer rides and more powerful waves.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Surf Etiquette Section */}
      <section className="bg-venao-light py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Surf Etiquette & Safety</h2>
            <p className="mb-6 text-center">
              Respecting local surf etiquette and safety guidelines helps ensure everyone has a safe and enjoyable experience:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Basic Etiquette</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Wait your turn and don't drop in on other surfers</li>
                  <li>The surfer closest to the peak has right of way</li>
                  <li>Communicate with calls like "Left!" or "Right!"</li>
                  <li>Don't paddle through the lineup; paddle around it</li>
                  <li>Respect locals and the environment</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Safety Tips</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Know your limits and surf within your ability</li>
                  <li>Always surf with a buddy when possible</li>
                  <li>Be aware of currents and changing conditions</li>
                  <li>Use a leash and check your equipment</li>
                  <li>Stay hydrated and protect yourself from the sun</li>
                </ul>
              </div>
            </div>
          </div>
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
                      frameBorder="0" 
                      marginWidth="0" 
                      marginHeight="0"
                      style={{ width: '100%', height: '400px' }}
                    />
                    <div className="footer">
                      <a className="logo" href="//www.surf-forecast.com/">
                        <img src="//www.surf-forecast.com/images/widget.png" width="1" height="1" alt="Surf Forecast" />
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
