
import * as React from "react"
import { format, isAfter, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // Demo events with more variety and images
  const events = [
    { 
      date: new Date(2025, 4, 15), 
      title: "Surf Competition", 
      description: "Annual surfing championship at Playa Cambutal",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 15), 
      title: "Beach Yoga", 
      description: "Morning yoga session at sunrise",
      image: "https://images.unsplash.com/photo-1506629905607-d9b8cda5362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 20), 
      title: "Beach Cleanup", 
      description: "Community beach cleanup event",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 22), 
      title: "Local Fish Market", 
      description: "Fresh catch of the day from local fishermen",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 25), 
      title: "Full Moon Party", 
      description: "Beachfront party under the full moon",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 28), 
      title: "Turtle Watching", 
      description: "Guided turtle nesting observation tour",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 1), 
      title: "Live Music Night", 
      description: "Local band performance at beachfront bar",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 5), 
      title: "Cooking Class", 
      description: "Learn to make traditional Panamanian dishes",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 8), 
      title: "Fishing Tournament", 
      description: "Sport fishing competition",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 12), 
      title: "Art Workshop", 
      description: "Beach painting and crafts session",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 15), 
      title: "Wildlife Tour", 
      description: "Guided tour to spot local wildlife",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 18), 
      title: "Sunset Horseback Ride", 
      description: "Horseback riding along the beach at sunset",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ]

  const selectedDateEvents = events.filter(event => 
    date && format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )

  // Get next 5 upcoming events
  const today = startOfDay(new Date())
  const upcomingEvents = events
    .filter(event => isAfter(event.date, today) || format(event.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  // Get dates that have events for highlighting
  const eventDates = events.map(event => event.date)

  const modifiers = {
    hasEvent: eventDates
  }

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: '4px'
    }
  }

  return (
    <div className="w-full space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Local Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-3 pointer-events-auto"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
            <div className="space-y-4 flex-1">
              <h3 className="font-semibold text-lg">
                Events for {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <div key={index} className="p-4 bg-accent rounded-lg border flex gap-4">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-lg mb-2">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events scheduled for this date.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-4 bg-card rounded-lg border flex gap-4 hover:shadow-md transition-shadow">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg">{event.title}</h4>
                    <span className="text-sm text-primary font-medium">
                      {format(event.date, 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(event.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCalendar;
