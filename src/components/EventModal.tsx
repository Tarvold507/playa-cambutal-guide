
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import EventModalHeader from './EventModalHeader';
import EventDetails from './EventDetails';

interface Event {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  location: string;
  host: string;
  event_date: string;
  image_url?: string;
}

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <EventModalHeader event={event} />
          <EventDetails event={event} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
