
import { useEffect } from 'react';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Featured from '../components/Featured';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCalendar from '../components/EventCalendar';
import BusinessDirectory from '../components/BusinessDirectory';
import LocalServices from '../components/LocalServices';

// Sample data for our sections
const cardItems = [
  {
    id: '1',
    title: 'Beautiful Beachfront Hotels',
    description: 'Wake up to the sound of waves with our selection of beachfront accommodations in Playa Cambutal.',
    imageSrc: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay',
    category: 'Stay'
  },
  {
    id: '2',
    title: 'Local & International Cuisine',
    description: 'Explore a diverse array of restaurants and cafes offering everything from local delicacies to international favorites.',
    imageSrc: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat',
    category: 'Eat'
  },
  {
    id: '3',
    title: 'Catch the Perfect Wave',
    description: 'Playa Cambutal is famous for its consistent waves, making it a paradise for surfers of all levels.',
    imageSrc: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf',
    category: 'Surf'
  },
  {
    id: '4',
    title: 'Yoga & Wellness',
    description: 'Find your zen with beachfront yoga classes and wellness activities for mind and body rejuvenation.',
    imageSrc: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do',
    category: 'Do'
  },
  {
    id: '5',
    title: 'Wildlife Excursions',
    description: 'Discover the rich biodiversity of Panama with guided tours to see monkeys, birds, and marine life.',
    imageSrc: 'https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do',
    category: 'Do'
  },
  {
    id: '6',
    title: 'Transportation Options',
    description: 'Find the best ways to get to and around Playa Cambutal, from airport shuttles to local taxis.',
    imageSrc: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/transportation',
    category: 'Transport'
  }
];

const Index = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Playa Cambutal Guide - Discover Panama's Hidden Paradise",
      "description": "Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities in this beautiful beach destination.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "TouristDestination",
        "name": "Playa Cambutal",
        "description": "A horseshoe-shaped bay on Panama's Pacific coast known for consistent waves, stunning sunsets, and laid-back atmosphere.",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 7.2833,
          "longitude": -80.5167
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "Panama",
          "addressRegion": "Los Santos Province",
          "addressLocality": "Cambutal"
        }
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.textContent === JSON.stringify(structuredData)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Discover Playa Cambutal, Panama"
        subtitle="Your ultimate guide to Panama's hidden beach paradise on the Azuero Peninsula"
        imageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Welcome to Playa Cambutal, Panama</h1>
          <p className="text-gray-600 mb-4">
            Nestled on Panama's Pacific coast in the Los Santos Province, Playa Cambutal is a horseshoe-shaped bay 
            known for its consistent surf waves, stunning sunsets, and laid-back atmosphere. Located on the Azuero Peninsula, 
            this hidden gem has evolved from a secret surf spot into Panama's beloved destination for travelers seeking 
            authentic beach experiences and world-class surfing.
          </p>
          <p className="text-gray-600 mb-4">
            Cambutal, Panama offers year-round warm weather, making it perfect for surfing, beach activities, and exploring 
            the rich culture of rural Panama. Whether you're planning your first visit to this Pacific coast paradise or 
            returning to experience more of what Playa Cambutal has to offer, our comprehensive guide provides everything 
            you need for an unforgettable Panama vacation.
          </p>
          <p className="text-gray-600">
            Discover why Playa Cambutal is becoming Panama's most sought-after beach destination for surfers, families, 
            and adventure seekers from around the world. From the best surf breaks to authentic Panamanian cuisine, 
            eco-friendly accommodations to thrilling wildlife tours - your perfect Cambutal experience awaits.
          </p>
        </div>
      </section>
      
      {/* Card Section */}
      <CardSection 
        title="Explore Playa Cambutal, Panama"
        description="Discover the best places to eat, stay, surf, and explore in Panama's premier beach destination."
        items={cardItems}
        bgColor="bg-gray-50"
      />
      
      {/* Calendar Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <EventCalendar />
        </div>
      </section>

      {/* Business Directory Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BusinessDirectory />
        </div>
      </section>

      {/* Local Services Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <LocalServices />
        </div>
      </section>
      
      {/* Featured Sections */}
      <Featured 
        title="Perfect Surf Waves Year Round in Panama"
        description="Playa Cambutal offers some of Panama's most consistent surf conditions throughout the year, making it an ideal destination for surfers of all levels. With a variety of breaks and waves ranging from gentle rollers to powerful point breaks, Cambutal has something for everyone. Local surf schools provide professional lessons and equipment rentals for beginners, while experienced surfers can find challenging waves, especially during Panama's prime swell season from March to November."
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Cambutal, Panama"
        link="/surf"
        linkText="Learn more about surfing in Cambutal"
        imageOnRight={true}
      />
      
      {/* Second Featured Section */}
      <Featured 
        title="Authentic Panama Culinary Experience"
        description="From beachfront seafood restaurants to upscale international dining, Playa Cambutal's food scene showcases the best of Panama's culinary diversity. Experience fresh-caught Pacific fish, traditional Panamanian dishes, wood-fired pizzas, and farm-to-table organic offerings. Many Cambutal restaurants source ingredients locally from the fertile Azuero Peninsula, and vegetarian and vegan options reflect Panama's growing sustainability movement. Don't miss trying local Panamanian specialties like ceviche and patacones while watching spectacular Pacific sunsets."
        imageSrc="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Delicious Panamanian food at a beachfront restaurant in Cambutal"
        link="/eat"
        linkText="Discover Cambutal restaurants"
        imageOnRight={false}
      />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
