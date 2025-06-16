import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import BusinessDirectory from '../components/BusinessDirectory';
import LocalServices from '../components/LocalServices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const RealEstateContent = () => <Card className="w-full">
    <CardHeader>
      <CardTitle>Real Estate Services</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Property Management</h3>
          <p className="text-gray-600">Professional property management services for vacation rentals and long-term properties.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Real Estate Agents</h3>
          <p className="text-gray-600">Local agents specializing in beachfront properties, land sales, and investment opportunities.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Property Development</h3>
          <p className="text-gray-600">Development companies offering new construction and renovation services.</p>
        </div>
      </div>
    </CardContent>
  </Card>;
const LegalContent = () => <Card className="w-full">
    <CardHeader>
      <CardTitle>Legal Services</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Property Law</h3>
          <p className="text-gray-600">Legal assistance with property purchases, titles, and real estate transactions.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Business Formation</h3>
          <p className="text-gray-600">Help with establishing businesses, corporations, and obtaining necessary permits.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Immigration Services</h3>
          <p className="text-gray-600">Assistance with visas, residency applications, and immigration procedures.</p>
        </div>
      </div>
    </CardContent>
  </Card>;
const TransportationContent = () => <Card className="w-full">
    <CardHeader>
      <CardTitle>Transportation Services</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Airport Transfers</h3>
          <p className="text-gray-600">Reliable transportation to and from Panama City airport and regional airports.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Local Taxi Services</h3>
          <p className="text-gray-600">Local taxi and ride services for getting around the area.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Car Rentals</h3>
          <p className="text-gray-600">Vehicle rental services including cars, ATVs, and motorcycles. <a href="https://www.autospanama.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Autos Panama</a> offers reliable rental options.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Shuttle Services</h3>
          <p className="text-gray-600">There are a few different shuttle services that operate in the area. The most commonly used ones are Pineapple Shuttles and My Pink Bus.</p>
        </div>
      </div>
    </CardContent>
  </Card>;
const Info = () => {
  const [activeTab, setActiveTab] = useState('services');
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check for hash in URL and set active tab accordingly
    const hash = window.location.hash.replace('#', '');
    if (hash === 'transportation') {
      setActiveTab('transportation');
      // Scroll to the tabs section after a brief delay
      setTimeout(() => {
        const tabsSection = document.querySelector('section[data-tabs]');
        if (tabsSection) {
          tabsSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []);
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero title="Information Guide" subtitle="Everything you need to know about Playa Cambutal" imageSrc="https://images.unsplash.com/photo-1596627116790-af6f46dddbae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80" />

      <section className="bg-white py-16" data-tabs>
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="businesses">Businesses</TabsTrigger>
              <TabsTrigger value="realestate">Real Estate</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="transportation">Transportation</TabsTrigger>
            </TabsList>
            <TabsContent value="services">
              <LocalServices />
            </TabsContent>
            <TabsContent value="businesses">
              <BusinessDirectory />
            </TabsContent>
            <TabsContent value="realestate">
              <RealEstateContent />
            </TabsContent>
            <TabsContent value="legal">
              <LegalContent />
            </TabsContent>
            <TabsContent value="transportation">
              <TransportationContent />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>;
};
export default Info;