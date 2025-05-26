
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="mb-4">
                Last Updated: April 14, 2023
              </p>
              
              <p className="mb-4">
                Please read these Terms of Service ("Terms") carefully before using the Playa Cambutal Guide website.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h2>
              
              <p className="mb-4">
                By accessing or using our website, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Information Accuracy</h2>
              
              <p className="mb-4">
                While we strive to provide accurate and up-to-date information about Playa Cambutal, we cannot guarantee the accuracy, completeness, or reliability of any information on our website. Information such as prices, schedules, and services offered by third parties may change without notice.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Third-Party Content and Links</h2>
              
              <p className="mb-4">
                Our website may contain links to third-party websites or services that are not owned or controlled by Playa Cambutal Guide. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. User Conduct</h2>
              
              <p className="mb-4">
                When using our website, you agree not to:
              </p>
              
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Attempt to gain unauthorized access to our website or systems</li>
                <li>Use the website for any illegal or unauthorized purpose</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Intellectual Property</h2>
              
              <p className="mb-4">
                All content on this website, including text, images, logos, and design, is the property of Playa Cambutal Guide and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute our content without our prior written consent.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Disclaimer of Warranties</h2>
              
              <p className="mb-4">
                Our website is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of our website or the information, content, or materials included on it.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Limitation of Liability</h2>
              
              <p className="mb-4">
                In no event shall Playa Cambutal Guide, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Changes to Terms</h2>
              
              <p className="mb-4">
                We reserve the right to modify or replace these Terms at any time. By continuing to access or use our website after any revisions become effective, you agree to be bound by the revised terms.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Contact Us</h2>
              
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at info@playacambutalguide.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
