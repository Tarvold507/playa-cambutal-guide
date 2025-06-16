
const EatTips = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dining Tips</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Best Dining Times</h3>
              <p className="text-gray-600">Many restaurants open for lunch around 11:30 AM and dinner service typically starts at 6:00 PM. Some places may close between 3:00-5:00 PM, so it's good to check ahead for afternoon dining.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Payment Methods</h3>
              <p className="text-gray-600">Most restaurants accept both cash (USD) and cards, but it's always good to have some cash on hand. Some smaller establishments may be cash-only, especially for drinks or snacks on the beach.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Local Specialties</h3>
              <p className="text-gray-600">Don't miss trying fresh seafood, especially the catch of the day. Local favorites include ceviche, grilled fish, and traditional Panamanian dishes like sancocho and patacones.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EatTips;
