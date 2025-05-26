
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditFormData {
  type?: 'event' | 'business';
  id?: string;
  title?: string;
  location?: string;
  host?: string;
  description?: string;
  name?: string;
  category?: string;
  address?: string;
  [key: string]: any;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkAdminStatus();
  }, [user, navigate]);

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      console.log('User role check:', userRole);

      if (!userRole || userRole.role !== 'admin') {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchPendingItems = async () => {
    try {
      console.log('Fetching pending items...');
      
      // Fetch ALL pending events using RPC call to bypass RLS
      const { data: events, error: eventsError } = await supabase
        .rpc('get_pending_events_for_admin');

      // If RPC doesn't exist, fallback to direct query
      if (eventsError) {
        console.log('RPC failed, trying direct query:', eventsError);
        const { data: fallbackEvents, error: fallbackError } = await supabase
          .from('events')
          .select(`
            *,
            profiles (name, email)
          `)
          .eq('approved', false)
          .order('created_at', { ascending: false });
        
        if (!fallbackError) {
          setPendingEvents(fallbackEvents || []);
        } else {
          console.error('Fallback events error:', fallbackError);
          setPendingEvents([]);
        }
      } else {
        setPendingEvents(events || []);
      }

      // Fetch ALL pending business listings
      const { data: businesses, error: businessError } = await supabase
        .from('business_listings')
        .select(`
          *,
          profiles (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Businesses query result:', { businesses, businessError });

      if (businessError) {
        console.error('Business error:', businessError);
        setPendingBusinesses([]);
      } else {
        setPendingBusinesses(businesses || []);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setPendingEvents([]);
      setPendingBusinesses([]);
    }
  };

  const handleApprove = async (type: 'events' | 'business_listings', id: string) => {
    try {
      const { error } = await supabase
        .from(type)
        .update({ 
          approved: true, 
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('admin.approved'),
        description: `The ${type.slice(0, -1)} has been approved successfully.`,
      });

      fetchPendingItems();
    } catch (error) {
      console.error('Error approving item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to approve item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (type: 'events' | 'business_listings', id: string) => {
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Item rejected",
        description: `The ${type.slice(0, -1)} has been rejected and removed.`,
      });

      fetchPendingItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to reject item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any, type: 'event' | 'business') => {
    setSelectedItem(item);
    setEditForm({ ...item, type });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedItem || !editForm.type) return;

    try {
      const { type, ...updateData } = editForm;
      const { error } = await supabase
        .from(type === 'event' ? 'events' : 'business_listings')
        .update(updateData)
        .eq('id', selectedItem.id);

      if (error) throw error;

      toast({
        title: "Item updated",
        description: "The item has been updated successfully.",
      });

      setIsEditing(false);
      setSelectedItem(null);
      setEditForm({});
      fetchPendingItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>
        
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">{t('admin.pendingEvents')} ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="businesses">{t('admin.pendingBusinesses')} ({pendingBusinesses.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <div className="space-y-4">
              {pendingEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{t('admin.noEvents')}</p>
                  </CardContent>
                </Card>
              ) : (
                pendingEvents.map((event: any) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Submitted by: {event.profiles?.name || 'Unknown'} ({event.profiles?.email || 'No email'})
                          </p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Host:</strong> {event.host}</p>
                        <p><strong>Description:</strong> {event.description}</p>
                        {event.full_description && (
                          <p><strong>Full Description:</strong> {event.full_description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove('events', event.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {t('admin.approve')}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleEdit(event, 'event')}
                        >
                          {t('admin.edit')}
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleReject('events', event.id)}
                        >
                          {t('admin.reject')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="businesses">
            <div className="space-y-4">
              {pendingBusinesses.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{t('admin.noBusinesses')}</p>
                  </CardContent>
                </Card>
              ) : (
                pendingBusinesses.map((business: any) => (
                  <Card key={business.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{business.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Submitted by: {business.profiles?.name || 'Unknown'} ({business.profiles?.email || 'No email'})
                          </p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p><strong>Category:</strong> {business.category}</p>
                        <p><strong>Address:</strong> {business.address}</p>
                        <p><strong>Phone:</strong> {business.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> {business.email || 'N/A'}</p>
                        <p><strong>Website:</strong> {business.website || 'N/A'}</p>
                        <p><strong>Description:</strong> {business.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove('business_listings', business.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {t('admin.approve')}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleEdit(business, 'business')}
                        >
                          {t('admin.edit')}
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleReject('business_listings', business.id)}
                        >
                          {t('admin.reject')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {editForm.type === 'event' ? 'Event' : 'Business Listing'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editForm.type === 'event' ? (
                <>
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-host">Host</Label>
                    <Input
                      id="edit-host"
                      value={editForm.host || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, host: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="edit-name">Business Name</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSaveEdit}>
                  {t('common.save')} Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
