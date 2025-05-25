
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_number: '',
    business_affiliated: false,
    business_name: '',
  });
  
  const [userEvents, setUserEvents] = useState([]);
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [eventReminders, setEventReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        whatsapp_number: profile.whatsapp_number || '',
        business_affiliated: profile.business_affiliated || false,
        business_name: profile.business_name || '',
      });
    }

    fetchUserData();
  }, [user, profile, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch user business listings
      const { data: businesses } = await supabase
        .from('business_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch event reminders
      const { data: reminders } = await supabase
        .from('user_event_reminders')
        .select(`
          id,
          event_id,
          events (
            id,
            title,
            event_date,
            location
          )
        `)
        .eq('user_id', user.id);

      setUserEvents(events || []);
      setUserBusinesses(businesses || []);
      setEventReminders(reminders || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Failed to save your profile information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('user_event_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      setEventReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
      toast({
        title: "Reminder removed",
        description: "Event reminder has been removed.",
      });
    } catch (error) {
      console.error('Error removing reminder:', error);
      toast({
        title: "Error",
        description: "Failed to remove reminder. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="businesses">My Businesses</TabsTrigger>
            <TabsTrigger value="reminders">Event Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="+507 1234-5678"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="business_affiliated"
                      checked={formData.business_affiliated}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, business_affiliated: checked as boolean }))
                      }
                    />
                    <Label htmlFor="business_affiliated">I am affiliated with a business</Label>
                  </div>
                  
                  {formData.business_affiliated && (
                    <div>
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input
                        id="business_name"
                        value={formData.business_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                        placeholder="Enter your business name"
                      />
                    </div>
                  )}
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>My Events ({userEvents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {userEvents.length === 0 ? (
                  <p className="text-muted-foreground">You haven't created any events yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userEvents.map((event: any) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(event.event_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Status: {event.approved ? 
                            <span className="text-green-600">Approved</span> : 
                            <span className="text-yellow-600">Pending Approval</span>
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="businesses">
            <Card>
              <CardHeader>
                <CardTitle>My Business Listings ({userBusinesses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {userBusinesses.length === 0 ? (
                  <p className="text-muted-foreground">You haven't created any business listings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userBusinesses.map((business: any) => (
                      <div key={business.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{business.name}</h3>
                        <p className="text-sm text-muted-foreground">{business.category}</p>
                        <p className="text-sm text-muted-foreground">{business.address}</p>
                        <p className="text-sm">
                          Status: {business.approved ? 
                            <span className="text-green-600">Approved</span> : 
                            <span className="text-yellow-600">Pending Approval</span>
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Event Reminders ({eventReminders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {eventReminders.length === 0 ? (
                  <p className="text-muted-foreground">You don't have any event reminders set.</p>
                ) : (
                  <div className="space-y-4">
                    {eventReminders.map((reminder: any) => (
                      <div key={reminder.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{reminder.events.title}</h3>
                          <p className="text-sm text-muted-foreground">{reminder.events.location}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(reminder.events.event_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeReminder(reminder.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
