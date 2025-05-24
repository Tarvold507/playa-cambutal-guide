
import * as React from "react"
import { format, isAfter, startOfDay, isToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null)
  
  // Demo events with more variety and images
  const events = [
    { 
      date: new Date(2025, 4, 15), 
      title: "Surf Competition", 
      description: "Annual surfing championship at Playa Cambutal",
      fullDescription: "Join us for the most exciting surfing event of the year! The Annual Surf Competition at Playa Cambutal brings together the best surfers from around the region. Competition starts at dawn with preliminary rounds, followed by semi-finals in the afternoon. Prizes will be awarded for best performance, best style, and crowd favorite. Food trucks and local vendors will be available throughout the day. Don't miss this incredible display of skill and ocean mastery!",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 15), 
      title: "Beach Yoga", 
      description: "Morning yoga session at sunrise",
      fullDescription: "Start your day with inner peace and harmony at our sunrise beach yoga session. This gentle flow class is suitable for all levels and takes place on the pristine sands of Playa Cambutal. Feel the ocean breeze as you move through sun salutations and connect with nature. Mats are provided, but feel free to bring your own. The session includes meditation and breathing exercises to set a positive tone for your entire day.",
      image: "https://images.unsplash.com/photo-1506629905607-d9b8cda5362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 20), 
      title: "Beach Cleanup", 
      description: "Community beach cleanup event",
      fullDescription: "Help us keep Playa Cambutal beautiful! Join our monthly community beach cleanup event where locals and visitors come together to preserve our stunning coastline. We provide all cleaning supplies, gloves, and bags. After the cleanup, enjoy refreshments and a small celebration of our collective effort. It's a great way to meet like-minded people while making a positive impact on our environment.",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 22), 
      title: "Local Fish Market", 
      description: "Fresh catch of the day from local fishermen",
      fullDescription: "Experience the authentic flavors of Playa Cambutal at our weekly fish market. Local fishermen bring their freshest catch directly from the morning's haul. You'll find red snapper, mahi-mahi, tuna, and other tropical fish varieties. Many vendors also offer prepared ceviche and grilled fish. It's not just shopping - it's a cultural experience where you can chat with fishermen about their techniques and the best spots along our coast.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 25), 
      title: "Full Moon Party", 
      description: "Beachfront party under the full moon",
      fullDescription: "Dance under the stars at our legendary Full Moon Party! This monthly celebration features live DJs, traditional Panamanian music, fire dancers, and beachfront cocktails. The party starts at sunset and goes until sunrise, with different music zones to suit every taste. Local food vendors serve traditional dishes, and the full moon provides the perfect natural lighting for an unforgettable night on the beach.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 4, 28), 
      title: "Turtle Watching", 
      description: "Guided turtle nesting observation tour",
      fullDescription: "Witness one of nature's most incredible spectacles during turtle nesting season! Our expert guides will lead you on a respectful observation tour to see sea turtles laying their eggs on our protected beaches. This is a rare opportunity to observe these magnificent creatures in their natural habitat. The tour includes education about conservation efforts and the importance of protecting nesting sites. Tours are conducted in small groups to minimize disturbance to the turtles.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 1), 
      title: "Live Music Night", 
      description: "Local band performance at beachfront bar",
      fullDescription: "Enjoy an evening of live music featuring the best local talent! Tonight's lineup includes traditional Panamanian folk music, reggae, and contemporary acoustic performances. The beachfront setting provides the perfect ambiance with ocean waves as your backdrop. Local craft beers and tropical cocktails are available, along with traditional bar snacks. Come early to get the best seats and stay late for the jam session that often follows the main performances.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 5), 
      title: "Cooking Class", 
      description: "Learn to make traditional Panamanian dishes",
      fullDescription: "Immerse yourself in Panamanian culture through its cuisine! Our hands-on cooking class teaches you to prepare authentic local dishes using traditional techniques and fresh, local ingredients. You'll learn to make sancocho, patacones, and fresh ceviche, among other regional specialties. The class includes a market tour to select ingredients, cooking instruction, and of course, enjoying the feast you've prepared together with fellow participants.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 8), 
      title: "Fishing Tournament", 
      description: "Sport fishing competition",
      fullDescription: "Test your angling skills in our annual sport fishing tournament! Open to all skill levels, this friendly competition takes place in the rich waters off Playa Cambutal. Boats and equipment can be rented locally, or bring your own gear. Categories include biggest catch, most fish, and best technique. The tournament includes breakfast, lunch on the water, and an evening awards ceremony with prizes for winners. Even if you don't win, you'll have fresh fish for dinner!",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 12), 
      title: "Art Workshop", 
      description: "Beach painting and crafts session",
      fullDescription: "Unleash your creativity with our outdoor art workshop on the beach! This relaxed session welcomes artists of all levels to paint, sketch, or craft while enjoying the beautiful coastal scenery. We provide all materials including canvases, paints, brushes, and easels. Local artists will be on hand to offer guidance and techniques for capturing the tropical landscape. At the end of the session, there's an informal exhibition where everyone can share their creations.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 15), 
      title: "Wildlife Tour", 
      description: "Guided tour to spot local wildlife",
      fullDescription: "Discover the incredible biodiversity of our region on this guided wildlife tour! Our experienced naturalist guides will take you through various ecosystems - from coastal mangroves to tropical dry forest - to spot monkeys, sloths, exotic birds, and other native species. The tour includes transportation, binoculars, and a field guide to help you identify the amazing creatures you'll encounter. This is perfect for nature lovers and photographers looking to capture Panama's incredible wildlife.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
      date: new Date(2025, 5, 18), 
      title: "Sunset Horseback Ride", 
      description: "Horseback riding along the beach at sunset",
      fullDescription: "Experience the magic of Playa Cambutal from horseback during golden hour! This gentle ride is suitable for all experience levels, from beginners to experienced riders. Well-trained horses will carry you along the pristine shoreline as the sun sets over the Pacific Ocean. The tour includes basic riding instruction, safety equipment, and plenty of stops for photos. End the evening with refreshments as you watch the stars emerge over the ocean. Truly unforgettable!",
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
                          <div className="space-y-2">
                            <p className="text-sm text-primary font-medium">
                              {format(event.date, 'EEEE, MMMM d, yyyy')}
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                              {event.fullDescription}
                            </p>
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
                        <span className="text-sm text-primary font-medium">
                          {format(event.date, 'MMM d')}
                          {isToday(event.date) && <span className="ml-1">(Today)</span>}
                        </span>
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
                    <div className="space-y-2">
                      <p className="text-sm text-primary font-medium">
                        {format(event.date, 'EEEE, MMMM d, yyyy')}
                        {isToday(event.date) && <span className="ml-2 text-accent-foreground bg-primary px-2 py-1 rounded-full text-xs">Today</span>}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {event.fullDescription}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCalendar;
