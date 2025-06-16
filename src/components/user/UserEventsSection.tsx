
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserEvents, UserEvent } from '@/hooks/useUserEvents';
import { useEventSeries } from '@/hooks/useEventSeries';
import { useAllUserEvents } from '@/hooks/useEvents';
import UserEventCard from './UserEventCard';
import UserEventEditForm from './UserEventEditForm';
import UserEventSeriesCard from './UserEventSeriesCard';
import EventCreationForm from '../EventCreationForm';

const UserEventsSection = () => {
  const { userEvents, loading, updateEvent, deleteEvent } = useUserEvents();
  const { data: eventSeries, isLoading: seriesLoading } = useEventSeries();
  const { data: allUserEvents, isLoading: allEventsLoading } = useAllUserEvents();
  const [editingEvent, setEditingEvent] = useState<UserEvent | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleEditEvent = (event: UserEvent) => {
    setEditingEvent(event);
  };

  const handleSaveEvent = (eventId: string, updates: Partial<UserEvent>) => {
    updateEvent(eventId, updates);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const handleEditSeries = (series: any) => {
    // TODO: Implement series editing
    console.log('Edit series:', series);
  };

  const handleDeleteSeries = (seriesId: string) => {
    // TODO: Implement series deletion
    console.log('Delete series:', seriesId);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleEditSuccess = () => {
    setEditingEvent(null);
  };

  // Separate single events from series events using allUserEvents
  const singleEvents = allUserEvents?.filter(event => !event.event_series_id) || [];
  const seriesEvents = allUserEvents?.filter(event => event.event_series_id && event.is_series_master) || [];
  const recurringInstances = allUserEvents?.filter(event => event.event_series_id && !event.is_series_master) || [];

  if (loading || seriesLoading || allEventsLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venao mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">My Events</h2>
          <p className="text-gray-600 text-sm">Manage your submitted events and recurring series</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Single Events ({singleEvents.length})</TabsTrigger>
          <TabsTrigger value="series">Event Series ({eventSeries?.length || 0})</TabsTrigger>
          <TabsTrigger value="instances">Recurring Instances ({recurringInstances.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
          {singleEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">You haven't created any single events yet.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {singleEvents.map((event) => (
                <UserEventCard
                  key={event.id}
                  event={event as UserEvent}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="series" className="space-y-4">
          {!eventSeries || eventSeries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">You haven't created any recurring event series yet.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Recurring Event
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventSeries.map((series) => (
                <UserEventSeriesCard
                  key={series.id}
                  series={series}
                  onEdit={handleEditSeries}
                  onDelete={handleDeleteSeries}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          {recurringInstances.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No recurring event instances found.</p>
              <p className="text-gray-400 text-sm">Recurring instances are automatically generated when you create an event series.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                These are the individual instances of your recurring events. Each instance can be edited or cancelled independently.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recurringInstances.map((event) => (
                  <UserEventCard
                    key={event.id}
                    event={event as UserEvent}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventCreationForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <UserEventEditForm
              event={editingEvent}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserEventsSection;
