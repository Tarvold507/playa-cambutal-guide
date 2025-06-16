const StayTips = () => {
  return <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Accommodation Tips</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Best Time to Book</h3>
              <p className="text-gray-600">We recommend booking your accommodation at least 3-4 months in advance for high season (December-April) and 1-2 months ahead for low season. Many places offer discounts for longer stays.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Location Considerations</h3>
              <p className="text-gray-600">Accommodations are spread out along the beach and in the hills along the beach. Heading into town there are additional accommodations along the main road. Along the main beach road offers easy access to most restaurants and services.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Amenities to Look For</h3>
              <p className="text-gray-600">Since Playa Cambutal can get quite hot, air conditioning or good fans are essential for comfort. Also consider if you need WiFi (quality varies), kitchen facilities, and whether the property has a generator (occasional power outages happen).</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default StayTips;