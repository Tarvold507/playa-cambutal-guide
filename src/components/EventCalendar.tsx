
import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // Demo events with more variety
  const events = [
    { date: new Date(2025, 4, 15), title: "Surf Competition", description: "Annual surfing championship at Playa Cambutal" },
    { date: new Date(2025, 4, 15), title: "Beach Yoga", description: "Morning yoga session at sunrise" },
    { date: new Date(2025, 4, 20), title: "Beach Cleanup", description: "Community beach cleanup event" },
    { date: new Date(2025, 4, 22), title: "Local Fish Market", description: "Fresh catch of the day from local fishermen" },
    { date: new Date(2025, 4, 25), title: "Full Moon Party", description: "Beachfront party under the full moon" },
    { date: new Date(2025, 4, 28), title: "Turtle Watching", description: "Guided turtle nesting observation tour" },
    { date: new Date(2025, 5, 1), title: "Live Music Night", description: "Local band performance at beachfront bar" },
    { date: new Date(2025, 5, 5), title: "Cooking Class", description: "Learn to make traditional Panamanian dishes" },
    { date: new Date(2025, 5, 8), title: "Fishing Tournament", description: "Sport fishing competition" },
    { date: new Date(2025, 5, 12), title: "Art Workshop", description: "Beach painting and crafts session" },
    { date: new Date(2025, 5, 15), title: "Wildlife Tour", description: "Guided tour to spot local wildlife" },
    { date: new Date(2025, 5, 18), title: "Sunset Horseback Ride", description: "Horseback riding along the beach at sunset" }
  ]

  const selectedDateEvents = events.filter(event => 
    date && format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )

  return (
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
          />
          <div className="space-y-4 flex-1">
            <h3 className="font-semibold text-lg">
              Events for {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg border">
                    <h4 className="font-medium text-lg mb-2">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
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
  );
};

export default EventCalendar;
