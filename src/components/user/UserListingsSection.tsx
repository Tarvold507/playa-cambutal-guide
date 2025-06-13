
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserListingCard from './UserListingCard';
import UserRestaurantEditForm from './UserRestaurantEditForm';
import UserBusinessEditForm from './UserBusinessEditForm';
import UserHotelEditForm from './UserHotelEditForm';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useUserRestaurants } from '@/hooks/useUserRestaurants';
import { useUserBusinesses } from '@/hooks/useUserBusinesses';
import { useUserHotels } from '@/hooks/useUserHotels';
import type { RestaurantListing } from '@/hooks/useRestaurantListings';
import type { BusinessListing } from '@/hooks/useBusinessListings';
import type { UserHotel } from '@/hooks/useUserHotels';

const UserListingsSection = () => {
  const { userEvents, loading: eventsLoading, deleteEvent } = useUserEvents();
  const { userRestaurants, loading: restaurantsLoading, updateRestaurant, deleteRestaurant } = useUserRestaurants();
  const { userBusinesses, loading: businessesLoading, updateBusiness, deleteBusiness } = useUserBusinesses();
  const { userHotels, loading: hotelsLoading, updateHotel, deleteHotel } = useUserHotels();

  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantListing | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<BusinessListing | null>(null);
  const [editingHotel, setEditingHotel] = useState<UserHotel | null>(null);

  const handleEditRestaurant = (restaurant: RestaurantListing) => {
    setEditingRestaurant(restaurant);
  };

  const handleEditBusiness = (business: BusinessListing) => {
    setEditingBusiness(business);
  };

  const handleEditHotel = (hotel: UserHotel) => {
    setEditingHotel(hotel);
  };

  const handleSaveRestaurant = (restaurantId: string, updates: Partial<RestaurantListing>) => {
    updateRestaurant(restaurantId, updates);
    setEditingRestaurant(null);
  };

  const handleSaveBusiness = (businessId: string, updates: Partial<BusinessListing>) => {
    updateBusiness(businessId, updates);
    setEditingBusiness(null);
  };

  const handleSaveHotel = (hotelId: string, updates: Partial<UserHotel>) => {
    updateHotel(hotelId, updates);
    setEditingHotel(null);
  };

  const EmptyState = ({ type, addLink }: { type: string; addLink: string }) => (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">You haven't submitted any {type} yet.</p>
      <Link to={addLink}>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Your First {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <div className="flex gap-2">
          <Link to="/events">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Event
            </Button>
          </Link>
          <Link to="/add-restaurant">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Restaurant
            </Button>
          </Link>
          <Link to="/add-hotel">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Hotel
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events ({userEvents.length})</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants ({userRestaurants.length})</TabsTrigger>
          <TabsTrigger value="businesses">Businesses ({userBusinesses.length})</TabsTrigger>
          <TabsTrigger value="hotels">Hotels ({userHotels.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {eventsLoading ? (
            <div className="text-center py-8">Loading your events...</div>
          ) : userEvents.length === 0 ? (
            <EmptyState type="events" addLink="/events" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userEvents.map((event) => (
                <UserListingCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  status={event.approved ? 'approved' : 'pending'}
                  type="event"
                  onDelete={() => deleteEvent(event.id)}
                  image={event.image_url || undefined}
                  location={event.location}
                  createdAt={event.created_at}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-4">
          {restaurantsLoading ? (
            <div className="text-center py-8">Loading your restaurants...</div>
          ) : userRestaurants.length === 0 ? (
            <EmptyState type="restaurants" addLink="/add-restaurant" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userRestaurants.map((restaurant) => (
                <UserListingCard
                  key={restaurant.id}
                  title={restaurant.name}
                  description={restaurant.description || undefined}
                  status={restaurant.approved ? 'approved' : 'pending'}
                  type="restaurant"
                  onEdit={() => handleEditRestaurant(restaurant)}
                  onDelete={() => deleteRestaurant(restaurant.id)}
                  image={restaurant.image_url || undefined}
                  address={restaurant.address}
                  createdAt={restaurant.created_at}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="businesses" className="space-y-4">
          {businessesLoading ? (
            <div className="text-center py-8">Loading your businesses...</div>
          ) : userBusinesses.length === 0 ? (
            <EmptyState type="businesses" addLink="/adventure" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userBusinesses.map((business) => (
                <UserListingCard
                  key={business.id}
                  title={business.name}
                  description={business.description || undefined}
                  status={business.approved ? 'approved' : 'pending'}
                  type="business"
                  onEdit={() => handleEditBusiness(business)}
                  onDelete={() => deleteBusiness(business.id)}
                  image={business.image_url || undefined}
                  address={business.address}
                  createdAt={business.created_at}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hotels" className="space-y-4">
          {hotelsLoading ? (
            <div className="text-center py-8">Loading your hotels...</div>
          ) : userHotels.length === 0 ? (
            <EmptyState type="hotels" addLink="/add-hotel" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userHotels.map((hotel) => (
                <UserListingCard
                  key={hotel.id}
                  title={hotel.name}
                  description={hotel.description || undefined}
                  status={hotel.approved ? 'approved' : 'pending'}
                  type="hotel"
                  onEdit={() => handleEditHotel(hotel)}
                  onDelete={() => deleteHotel(hotel.id)}
                  image={hotel.image_url || undefined}
                  address={hotel.address}
                  createdAt={hotel.created_at}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Restaurant Dialog */}
      <Dialog open={!!editingRestaurant} onOpenChange={() => setEditingRestaurant(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
          </DialogHeader>
          {editingRestaurant && (
            <UserRestaurantEditForm
              restaurant={editingRestaurant}
              onSave={handleSaveRestaurant}
              onCancel={() => setEditingRestaurant(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog */}
      <Dialog open={!!editingBusiness} onOpenChange={() => setEditingBusiness(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
          </DialogHeader>
          {editingBusiness && (
            <UserBusinessEditForm
              business={editingBusiness}
              onSave={handleSaveBusiness}
              onCancel={() => setEditingBusiness(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={!!editingHotel} onOpenChange={() => setEditingHotel(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
          </DialogHeader>
          {editingHotel && (
            <UserHotelEditForm
              hotel={editingHotel}
              onSave={handleSaveHotel}
              onCancel={() => setEditingHotel(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserListingsSection;
