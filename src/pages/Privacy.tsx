
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="mb-4">
                Last Updated: April 14, 2023
              </p>
              
              <p className="mb-4">
                At Venao Guide, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information We Collect</h2>
              
              <p className="mb-4">
                <strong>Personal Information:</strong> We may collect personal information such as your name, email address, and phone number when you subscribe to our newsletter, contact us, or make inquiries through our website.
              </p>
              
              <p className="mb-4">
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including your IP address, browser type, pages visited, and time spent on each page.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How We Use Your Information</h2>
              
              <p className="mb-4">
                We use the information we collect to:
              </p>
              
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and improve our services</li>
                <li>Respond to your inquiries and comments</li>
                <li>Send newsletters and updates if you've subscribed</li>
                <li>Analyze website usage to improve user experience</li>
                <li>Protect our website against unauthorized access</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cookies and Tracking Technologies</h2>
              
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Third-Party Services</h2>
              
              <p className="mb-4">
                We may use third-party services such as Google Analytics to monitor and analyze the use of our website. These third parties have their own privacy policies addressing how they use such information.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Security</h2>
              
              <p className="mb-4">
                We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Your Rights</h2>
              
              <p className="mb-4">
                You have the right to access, update, or delete the personal information we have about you. You can also opt out of receiving communications from us at any time by clicking the "unsubscribe" link in our emails or contacting us directly.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Changes to This Privacy Policy</h2>
              
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Contact Us</h2>
              
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at info@venaoguide.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
