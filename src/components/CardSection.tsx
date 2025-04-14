
import Card from './Card';

interface CardItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category?: string;
}

interface CardSectionProps {
  title: string;
  description?: string;
  items: CardItem[];
  bgColor?: string;
}

const CardSection = ({ title, description, items, bgColor = 'bg-gray-50' }: CardSectionProps) => {
  return (
    <section className={`${bgColor} py-16 md:py-24`} id="content">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              imageSrc={item.imageSrc}
              link={item.link}
              category={item.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
