
import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // Sample events - in a real app, these would come from a database
  const events = [
    { date: new Date(2025, 3, 15), title: "Surf Competition" },
    { date: new Date(2025, 3, 20), title: "Beach Cleanup" },
    { date: new Date(2025, 3, 25), title: "Full Moon Party" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Local Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border p-3 pointer-events-auto"
          />
          <div className="space-y-4">
            <h3 className="font-semibold">
              Events for {date ? format(date, 'MMMM yyyy') : 'Select a date'}
            </h3>
            <ul className="space-y-2">
              {events
                .filter(event => date && format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                .map((event, index) => (
                  <li key={index} className="p-2 bg-accent rounded-md">
                    {event.title}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
