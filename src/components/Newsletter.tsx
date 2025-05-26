
import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically handle the newsletter subscription
    // For now, we'll just show a success message
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-venao text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="max-w-2xl mx-auto mb-8">
          Join our newsletter to stay updated with the latest news, travel tips, and special offers for Playa Cambutal.
        </p>
        
        {isSubmitted ? (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <p className="text-white">Thank you for subscribing! You'll receive updates soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 
                         focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-white text-venao-dark font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
