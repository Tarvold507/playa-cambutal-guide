
import { Wrench, Stethoscope, Waves, Car, ShieldCheck, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from '@/contexts/LanguageContext';

const LocalServices = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      name: t('services.emergency'),
      icon: Stethoscope,
      details: t('services.emergencyDetails')
    },
    {
      name: t('services.surfLessons'),
      icon: Waves,
      details: t('services.surfDetails')
    },
    {
      name: t('services.carRental'),
      icon: Car,
      details: t('services.carDetails')
    },
    {
      name: t('services.security'),
      icon: ShieldCheck,
      details: t('services.securityDetails')
    },
    {
      name: t('services.language'),
      icon: School,
      details: t('services.languageDetails')
    },
    {
      name: t('services.maintenance'),
      icon: Wrench,
      details: t('services.maintenanceDetails')
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('services.title')}</CardTitle>
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
