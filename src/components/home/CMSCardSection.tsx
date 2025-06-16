
import { useCMSContent } from '@/hooks/useCMSContent';
import CardSection from '../CardSection';

const CMSCardSection = () => {
  const { content, isReady } = useCMSContent('/', 'cards', {
    title: 'Explore Costa Rica',
    description: 'Discover the best experiences Costa Rica has to offer',
    cards: []
  });

  if (!isReady || !content) {
    return (
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no cards are configured in CMS, don't render anything
  if (!content.cards || content.cards.length === 0) {
    return null;
  }

  return (
    <CardSection 
      title={content.title}
      description={content.description}
      items={content.cards}
      bgColor="bg-gray-50"
    />
  );
};

export default CMSCardSection;
