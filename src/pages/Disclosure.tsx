
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Disclosure = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Affiliate Disclosure
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Transparency Notice
              </h2>
              <p>
                At Playa Cambutal, we believe in transparency and honesty with our visitors. 
                This disclosure page explains our affiliate relationships and how we may earn 
                commissions from certain recommendations on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                What Are Affiliate Links?
              </h2>
              <p>
                Affiliate links are special URLs that allow us to earn a small commission 
                when you make a purchase or booking through them. These links help support 
                our website and allow us to continue providing free content and resources 
                about Playa Cambutal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Our Affiliate Relationships
              </h2>
              <p>
                We may earn commissions from the following types of bookings and purchases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hotel and accommodation bookings</li>
                <li>Restaurant reservations</li>
                <li>Activity and tour bookings</li>
                <li>Transportation services</li>
                <li>Travel-related products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                No Additional Cost to You
              </h2>
              <p>
                Using our affiliate links does <strong>not</strong> cost you anything extra. 
                You pay the same price you would pay if you booked directly with the provider. 
                The commission we receive comes from the business, not from your payment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Our Commitment to Honest Reviews
              </h2>
              <p>
                Our affiliate relationships do not influence our opinions, reviews, or 
                recommendations. We only recommend businesses, services, and experiences 
                that we believe provide value to visitors to Playa Cambutal. Our reviews 
                are based on genuine experiences and honest assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Supporting Local Businesses
              </h2>
              <p>
                We prioritize promoting local businesses and services in the Playa Cambutal 
                area. When possible, we encourage direct bookings with local establishments 
                to ensure they receive the maximum benefit from your visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Contact Us
              </h2>
              <p>
                If you have any questions about our affiliate relationships or this 
                disclosure, please contact us at{' '}
                <a 
                  href="mailto:info@playacambutal.com" 
                  className="text-primary hover:underline"
                >
                  info@playacambutal.com
                </a>
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                FTC Compliance
              </h2>
              <p>
                This disclosure is made in accordance with the Federal Trade Commission's 
                16 CFR, Part 255: "Guides Concerning the Use of Endorsements and 
                Testimonials in Advertising."
              </p>
            </section>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Disclosure;
