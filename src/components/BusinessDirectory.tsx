
import { Store, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from '@/contexts/LanguageContext';

const BusinessDirectory = () => {
  const { t } = useLanguage();
  
  const businesses = [
    {
      name: "Cambutal Surf Shop",
      category: t('directory.retail'),
      address: "Main Beach Road",
      phone: "+507 123-4567"
    },
    {
      name: "Ocean View Restaurant",
      category: t('directory.restaurant'),
      address: "Playa Cambutal",
      phone: "+507 123-4568"
    },
    {
      name: "Beach Yoga Studio",
      category: t('directory.fitness'),
      address: "Sunset Point",
      phone: "+507 123-4569"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          {t('directory.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business, index) => (
            <Card key={index} className="bg-accent/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{business.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{business.category}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {business.address}
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Phone className="h-4 w-4" />
                  {business.phone}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessDirectory;
