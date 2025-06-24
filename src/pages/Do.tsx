
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import DoPageHero from '../components/do/DoPageHero';
import OptimizedCMSDoIntro from '../components/do/OptimizedCMSDoIntro';
import DoActivitiesSection from '../components/do/DoActivitiesSection';
import DoBusinessSubmission from '../components/do/DoBusinessSubmission';
import DoFeaturedSections from '../components/do/DoFeaturedSections';
import DoSEO from '../components/do/DoSEO';
import { useDoPageLogic } from '../hooks/useDoPageLogic';

const Do = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    isLoading,
    error
  } = useDoPageLogic();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <DoSEO />
      <Navbar />
      <DoPageHero />
      <OptimizedCMSDoIntro />
      <DoActivitiesSection 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filteredItems={filteredItems}
        isLoading={isLoading}
      />
      <DoBusinessSubmission />
      <DoFeaturedSections />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Do;
