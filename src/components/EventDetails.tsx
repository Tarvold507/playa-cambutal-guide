
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

interface EventDetailsProps {
  event: Event;
}

const EventDetails = ({ event }: EventDetailsProps) => {
  return (
    <>
      {event.description && (
        <div>
          <h3 className="font-semibold mb-2">About this event</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>
      )}

      {event.full_description && (
        <div>
          <h3 className="font-semibold mb-2">Details</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{event.full_description}</p>
        </div>
      )}
    </>
  );
};

export default EventDetails;
