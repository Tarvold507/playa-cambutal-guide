
import * as React from "react"
import { format, isAfter, startOfDay, isToday, parseISO, isWithinInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, User, Filter, Plus, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/contexts/AuthContext"
import EventCreationForm from "./EventCreationForm"

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null)
  const [eventTypeFilter, setEventTypeFilter] = React.useState<string>("all")
  const [dateRangeStart, setDateRangeStart] = React.useState<Date | undefined>()
  const [dateRangeEnd, setDateRangeEnd] = React.useState<Date | undefined>()
  const [showEventCreation, setShowEventCreation] = React.useState(false)
  
  const { data: events = [], isLoading } = useEvents()
  const { user } = useAuth()
  
  // Mock authentication state - replace with actual auth when Supabase is connected
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [reminderChecked, setReminderChecked] = React.useState(false)

  // Demo events with event types
  const demoEvents = [
    { 
      date: new Date(2025, 4, 15), 
      title: "Surf Competition", 
      description: "Annual surfing championship at Playa Cambutal",
      fullDescription: "Join us for the most exciting surfing event of the year! The Annual Surf Competition at Playa Cambutal brings together the best surfers from around the region. Competition starts at dawn with preliminary rounds, followed by semi-finals in the afternoon. Prizes will be awarded for best performance, best style, and crowd favorite. Food trucks and local vendors will be available throughout the day. Don't miss this incredible display of skill and ocean mastery!",
      location: "Playa Cambutal Beach",
      host: "Cambutal Surf Club",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      type: "social"
    },
    { 
      date: new Date(2025, 4, 15), 
      title: "Beach Yoga", 
      description: "Morning yoga session at sunrise",
      fullDescription: "Start your day with inner peace and harmony at our sunrise beach yoga session. This gentle flow class is suitable for all levels and takes place on the pristine sands of Playa Cambutal. Feel the ocean breeze as you move through sun salutations and connect with nature. Mats are provided, but feel free to bring your own. The session includes meditation and breathing exercises to set a positive tone for your entire day.",
      location: "Main Beach Area",
      host: "Wellness Center Cambutal",
      image: "https://images.unsplash.com/photo-1506629905607-d9b8cda5362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      type: "classes"
    },
    { 
      date: new Date(2025, 4, 20), 
      title: "Kids Beach Adventure", 
      description: "Fun beach activities for children",
      fullDescription: "A fun-filled day designed specifically for children! Activities include sandcastle building contests, treasure hunts, beach games, and nature exploration. Our experienced staff will guide kids through safe and educational activities while parents can relax nearby. Suitable for ages 5-12. All materials and snacks provided.",
      location: "Family Beach Area",
      host: "Cambutal Kids Club",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      type: "kids"
    },
    { 
      date: new Date(2025, 4, 22), 
      title: "Cooking Class", 
      description: "Learn to make traditional Panamanian dishes",
      fullDescription: "Immerse yourself in Panamanian culture through its cuisine! Our hands-on cooking class teaches you to prepare authentic local dishes using traditional techniques and fresh, local ingredients. You'll learn to make sancocho, patacones, and fresh ceviche, among other regional specialties. The class includes a market tour to select ingredients, cooking instruction, and of course, enjoying the feast you've prepared together with fellow participants.",
      location: "Community Kitchen Center",
      host: "Chef Maria Gonzalez",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      type: "classes"
    },
    { 
      date: new Date(2025, 4, 25), 
      title: "Full Moon Party", 
      description: "Beachfront party under the full moon",
      fullDescription: "Dance under the stars at our legendary Full Moon Party! This monthly celebration features live DJs, traditional Panamanian music, fire dancers, and beachfront cocktails. The party starts at sunset and goes until sunrise, with different music zones to suit every taste. Local food vendors serve traditional dishes, and the full moon provides the perfect natural lighting for an unforgettable night on the beach.",
      location: "South Beach - Main Party Area",
      host: "Cambutal Nightlife Collective",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      type: "social"
    }
  ]

  // Combine real events with demo events and normalize the image property
  const allEvents = [
    ...demoEvents, 
    ...events.map(event => ({
      ...event,
      date: parseISO(event.event_date),
      fullDescription: event.full_description,
      image: event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Default image
      type: "social" // Default type for database events
    }))
  ]

  // Filter events based on selected criteria
  const filteredEvents = React.useMemo(() => {
    return allEvents.filter(event => {
      // Filter by event type
      if (eventTypeFilter !== "all" && event.type !== eventTypeFilter) {
        return false
      }
      
      // Filter by date range
      if (dateRangeStart && dateRangeEnd) {
        const eventDate = event.date
        if (!isWithinInterval(eventDate, { start: dateRangeStart, end: dateRangeEnd })) {
          return false
        }
      }
      
      return true
    })
  }, [allEvents, eventTypeFilter, dateRangeStart, dateRangeEnd])

  const selectedDateEvents = filteredEvents.filter(event => 
    date && format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )

  // Get next 5 upcoming events
  const today = startOfDay(new Date())
  const upcomingEvents = filteredEvents
    .filter(event => isAfter(event.date, today) || format(event.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  // Get dates that have events for highlighting
  const eventDates = filteredEvents.map(event => event.date)
  const todayDate = new Date()

  const modifiers = {
    hasEvent: eventDates,
    today: todayDate
  }

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: '4px'
    },
    today: {
      backgroundColor: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
      border: '2px solid hsl(var(--primary))',
      borderRadius: '4px',
      fontWeight: 'bold'
    }
  }

  const handleReminderChange = (event: any) => {
    if (!user) {
      alert('Please log in to set event reminders.')
      return
    }
    
    setReminderChecked(!reminderChecked)
    console.log('Reminder set for event:', event.title)
  }

  const clearFilters = () => {
    setEventTypeFilter("all")
    setDateRangeStart(undefined)
    setDateRangeEnd(undefined)
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
                {date && isToday(date) && <span className="text-primary ml-2">(Today)</span>}
              </h3>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="p-4 bg-accent rounded-lg border flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
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
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{event.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="space-y-4">
                            <p className="text-sm text-primary font-medium">
                              {format(event.date, 'EEEE, MMMM d, yyyy')}
                            </p>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>Hosted by {event.host}</span>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed">
                              {event.fullDescription}
                            </p>
                            
                            <div className="border-t pt-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="reminder" 
                                  checked={reminderChecked}
                                  onCheckedChange={() => handleReminderChange(event)}
                                />
                                <label htmlFor="reminder" className="text-sm font-medium">
                                  Remind me before this event
                                </label>
                              </div>
                              {!user && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Log in to save event reminders to your profile
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events scheduled for this date.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Events
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="classes">Classes</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !dateRangeStart && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRangeStart ? format(dateRangeStart, "MMM dd") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRangeStart}
                      onSelect={setDateRangeStart}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !dateRangeEnd && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRangeEnd ? format(dateRangeEnd, "MMM dd") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRangeEnd}
                      onSelect={setDateRangeEnd}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="p-4 bg-card rounded-lg border flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-lg">{event.title}</h4>
                        <div className="text-right">
                          <span className="text-sm text-primary font-medium">
                            {format(event.date, 'MMM d')}
                            {isToday(event.date) && <span className="ml-1">(Today)</span>}
                          </span>
                          <div className="text-xs text-muted-foreground capitalize">
                            {event.type}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.date, 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="space-y-4">
                      <p className="text-sm text-primary font-medium">
                        {format(event.date, 'EEEE, MMMM d, yyyy')}
                        {isToday(event.date) && <span className="ml-2 text-accent-foreground bg-primary px-2 py-1 rounded-full text-xs">Today</span>}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Hosted by {event.host}</span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {event.fullDescription}
                      </p>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`reminder-${index}`} 
                            checked={reminderChecked}
                            onCheckedChange={() => handleReminderChange(event)}
                          />
                          <label htmlFor={`reminder-${index}`} className="text-sm font-medium">
                            Remind me before this event
                          </label>
                        </div>
                        {!user && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Log in to save event reminders to your profile
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Your Event Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Your Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Have an event you'd like to share with the community? Submit it for review and approval.
            </p>
            <Dialog open={showEventCreation} onOpenChange={setShowEventCreation}>
              <DialogTrigger asChild>
                <Button size="lg" className="mx-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <EventCreationForm onSuccess={() => setShowEventCreation(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCalendar;
