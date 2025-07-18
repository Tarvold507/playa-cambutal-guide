
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { subscribe, isSubmitting } = useNewsletterSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    const result = await subscribe(email.trim());
    
    if (result.success) {
      setIsSubmitted(true);
      setEmail('');
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  return (
    <section className="bg-venao text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('newsletter.title')}</h2>
        <p className="max-w-2xl mx-auto mb-8">
          {t('newsletter.description')}
        </p>
        
        {isSubmitted ? (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <p className="text-white">{t('newsletter.success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 
                         focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="px-6 py-2 bg-white text-venao-dark font-medium rounded-lg hover:bg-gray-100 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-venao-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t('newsletter.subscribe')
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
