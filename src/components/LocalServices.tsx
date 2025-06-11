
import { Wrench, Stethoscope, Waves, Car, ShieldCheck, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedPageContent } from '@/hooks/useOptimizedPageContent';

const LocalServices = () => {
  const { t } = useLanguage();
  const { pageContent, getContentBySection, isReady } = useOptimizedPageContent('/info');
  
  // Get CMS content or use fallback
  const servicesContent = getContentBySection('services', {
    title: t('services.title'),
    services: [
      {
        name: t('services.emergency'),
        icon: 'Stethoscope',
        details: t('services.emergencyDetails')
      },
      {
        name: t('services.surfLessons'),
        icon: 'Waves',
        details: t('services.surfDetails')
      },
      {
        name: t('services.carRental'),
        icon: 'Car',
        details: t('services.carDetails')
      },
      {
        name: t('services.security'),
        icon: 'ShieldCheck',
        details: t('services.securityDetails')
      },
      {
        name: t('services.language'),
        icon: 'School',
        details: t('services.languageDetails')
      },
      {
        name: t('services.maintenance'),
        icon: 'Wrench',
        details: t('services.maintenanceDetails')
      }
    ]
  });

  // Icon mapping
  const iconMap = {
    Stethoscope,
    Waves,
    Car,
    ShieldCheck,
    School,
    Wrench
  };

  const services = servicesContent.services || [];
  const title = servicesContent.title || t('services.title');

  // Show loading state
  if (!isReady) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Wrench;
            
            return (
              <Card key={index} className="bg-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-5 w-5" />
                    <h3 className="font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalServices;
