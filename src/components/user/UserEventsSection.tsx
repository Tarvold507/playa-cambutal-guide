
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserEvents, UserEvent } from '@/hooks/useUserEvents';
import UserEventCard from './UserEventCard';
import UserEventEditForm from './UserEventEditForm';
import EventCreationForm from '../EventCreationForm';

const UserEventsSection = () => {
  const { userEvents, loading, updateEvent, deleteEvent } = useUserEvents();
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

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  if (loading) {
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
          <p className="text-gray-600 text-sm">Manage your submitted events</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {userEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userEvents.map((event) => (
            <UserEventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

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
              onSave={handleSaveEvent}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserEventsSection;
