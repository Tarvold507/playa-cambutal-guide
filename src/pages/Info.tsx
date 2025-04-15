import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import BusinessDirectory from '../components/BusinessDirectory';
import LocalServices from '../components/LocalServices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import RealEstate from './RealEstate';
import Legal from './Legal';
import Transportation from './Transportation';

const Info = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero 
        title="Information Guide"
        subtitle="Everything you need to know about Playa Cambutal"
        imageSrc="https://images.unsplash.com/photo-1596627116790-af6f46dddbae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="services" className="w-full">
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
              <RealEstate />
            </TabsContent>
            <TabsContent value="legal">
              <Legal />
            </TabsContent>
            <TabsContent value="transportation">
              <Transportation />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Info;
