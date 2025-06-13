
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserProfileSection from '../components/user/UserProfileSection';
import UserListingsSection from '../components/user/UserListingsSection';
import EventRemindersSection from '../components/user/EventRemindersSection';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="reminders">Event Reminders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <UserProfileSection />
            </TabsContent>
            
            <TabsContent value="listings" className="mt-6">
              <UserListingsSection />
            </TabsContent>
            
            <TabsContent value="reminders" className="mt-6">
              <EventRemindersSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
