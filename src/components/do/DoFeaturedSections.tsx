
import Featured from '../Featured';

const DoFeaturedSections = () => {
  return (
    <>
      <Featured 
        title="Surf Paradise"
        description="Playa Cambutal offers consistent waves throughout the year, making it an ideal destination for surfers of all levels. With a variety of breaks and waves ranging from gentle rollers to powerful point breaks, there's something for everyone. Local surf schools provide lessons and equipment rentals for beginners, while experienced surfers can find challenging waves during peak seasons."
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Cambutal"
        link="/do/surf"
        linkText="Learn more about surfing"
        imageOnRight={true}
      />
      
      <Featured 
        title="Nature & Wildlife"
        description="Immerse yourself in Panama's incredible biodiversity. Take guided tours to spot monkeys, exotic birds, and marine life. Hike through pristine rainforests, discover hidden waterfalls, or join conservation efforts to protect local wildlife. Our experienced guides ensure unforgettable encounters with nature."
        imageSrc="https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Wildlife viewing in Panama"
        link="/do/wildlife"
        linkText="Explore nature activities"
        imageOnRight={false}
      />
    </>
  );
};

export default DoFeaturedSections;
