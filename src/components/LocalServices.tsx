
import { Wrench, FirstAid, Waves, Car, ShieldCheck, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    name: "Emergency Services",
    icon: FirstAid,
    details: "Local clinic and emergency contacts"
  },
  {
    name: "Surf Lessons",
    icon: Waves,
    details: "Professional instructors available"
  },
  {
    name: "Car Rental",
    icon: Car,
    details: "Local vehicle rental services"
  },
  {
    name: "Security",
    icon: ShieldCheck,
    details: "Local police and security services"
  },
  {
    name: "Language School",
    icon: School,
    details: "Spanish lessons and tutoring"
  },
  {
    name: "Maintenance",
    icon: Wrench,
    details: "Home and property maintenance"
  }
];

const LocalServices = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Local Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="bg-accent/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <service.icon className="h-5 w-5" />
                  <h3 className="font-semibold">{service.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{service.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalServices;
