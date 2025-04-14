
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import { FileText, Gavel, Key } from 'lucide-react';

const Legal = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero 
        title="Legal Resources"
        subtitle="Your guide to legal matters in Playa Cambutal"
        imageSrc="https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Legal Information</h2>
          <p className="text-gray-600">
            Understanding the legal aspects of living, working, or investing in Panama is crucial. 
            We provide resources and connections to help you navigate legal requirements and processes.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 bg-venao/10 rounded-lg mb-6">
                  <FileText className="w-6 h-6 text-venao" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Residency & Visas</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Tourist Visa Requirements</li>
                  <li>• Residency Programs</li>
                  <li>• Work Permits</li>
                  <li>• Retirement Visas</li>
                  <li>• Document Requirements</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 bg-venao/10 rounded-lg mb-6">
                  <Key className="w-6 h-6 text-venao" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Property Laws</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Property Rights</li>
                  <li>• Title Search Process</li>
                  <li>• Purchase Procedures</li>
                  <li>• Zoning Regulations</li>
                  <li>• Building Permits</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 bg-venao/10 rounded-lg mb-6">
                  <Gavel className="w-6 h-6 text-venao" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Business Laws</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Business Registration</li>
                  <li>• Corporation Formation</li>
                  <li>• Tax Obligations</li>
                  <li>• Employment Laws</li>
                  <li>• License Requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Legal Resources</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Legal Representation</h3>
                <p className="text-gray-600">We can connect you with experienced bilingual lawyers who specialize in real estate, immigration, and business law in Panama.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Document Services</h3>
                <p className="text-gray-600">Need help with document translation or notarization? Our network includes certified translators and notaries who can assist with official documentation.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Consulting Services</h3>
                <p className="text-gray-600">Get professional guidance on legal matters, from property purchases to business formation. Our consultants can help you understand your options and requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Legal;
