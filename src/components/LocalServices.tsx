
import { useState } from 'react';
import { Wrench, Stethoscope, Waves, Car, ShieldCheck, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedPageContent } from '@/hooks/useOptimizedPageContent';
import ServiceDetailModal from './ServiceDetailModal';

const LocalServices = () => {
  const { t } = useLanguage();
  const { pageContent, getContentBySection, isReady } = useOptimizedPageContent('/info');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get CMS content or use fallback with enhanced data
  const servicesContent = getContentBySection('services', {
    title: t('services.title'),
    services: [
      {
        name: t('services.emergency'),
        icon: 'Stethoscope',
        details: t('services.emergencyDetails'),
        fullDescription: "Comprehensive emergency medical services and healthcare facilities available 24/7 in the Playa Cambutal area. Our network includes immediate response services, local clinics, and referral hospitals.",
        emergencyNumbers: [
          {
            name: "Emergency Services (Panama)",
            number: "911",
            description: "All emergencies - Police, Fire, Medical"
          },
          {
            name: "Tourist Police",
            number: "+507 511-9260",
            description: "Specialized assistance for tourists"
          },
          {
            name: "Red Cross",
            number: "+507 315-1389",
            description: "Emergency medical assistance"
          }
        ],
        facilities: [
          {
            name: "Centro de Salud Cambutal",
            address: "Main Street, Cambutal",
            phone: "+507 995-8123",
            hours: "Monday-Friday 7:00 AM - 3:00 PM",
            services: ["Basic medical care", "Emergency stabilization", "Vaccinations", "Health consultations"],
            description: "Local health center providing basic medical services and emergency care."
          },
          {
            name: "Hospital Regional de Azuero",
            address: "Chitré, Los Santos",
            phone: "+507 996-4444",
            hours: "24/7 Emergency Department",
            services: ["Emergency care", "Surgery", "Intensive care", "Specialized treatments"],
            description: "Regional hospital approximately 1.5 hours away, providing comprehensive medical services."
          },
          {
            name: "Clínica San Fernando",
            address: "Las Tablas, Los Santos",
            phone: "+507 994-6666",
            hours: "Monday-Saturday 7:00 AM - 7:00 PM",
            services: ["General medicine", "Laboratory", "X-rays", "Pharmacy"],
            description: "Private clinic offering various medical services, about 1 hour from Cambutal."
          }
        ],
        hours: "Emergency services available 24/7"
      },
      {
        name: t('services.surfLessons'),
        icon: 'Waves',
        details: t('services.surfDetails'),
        fullDescription: "Professional surf instruction from certified local instructors who know the waters around Playa Cambutal. All skill levels welcome, from complete beginners to advanced surfers looking to improve their technique.",
        contacts: [
          {
            name: "Cambutal Surf School",
            phone: "+507 6123-4567",
            whatsapp: "+507 6123-4567",
            type: "Surf School",
            description: "Beginner to advanced lessons, board rental, and surf tours"
          },
          {
            name: "Local Surf Guide - Carlos",
            phone: "+507 6987-6543",
            whatsapp: "+507 6987-6543",
            type: "Private Instructor",
            description: "Personalized lessons and secret spot tours"
          }
        ],
        hours: "Lessons available daily 6:00 AM - 6:00 PM (weather permitting)"
      },
      {
        name: t('services.carRental'),
        icon: 'Car',
        details: t('services.carDetails'),
        fullDescription: "Reliable vehicle rental services including cars, ATVs, and motorcycles for exploring the beautiful Azuero Peninsula. All vehicles are well-maintained and include basic insurance.",
        contacts: [
          {
            name: "Cambutal Rentals",
            phone: "+507 6555-1234",
            whatsapp: "+507 6555-1234",
            type: "Car & ATV Rental",
            description: "Cars, ATVs, motorcycles. Daily and weekly rates available."
          },
          {
            name: "Peninsula Motors",
            phone: "+507 6777-8899",
            type: "Vehicle Rental",
            description: "Car rental with delivery service to your accommodation"
          }
        ],
        hours: "Open daily 7:00 AM - 7:00 PM"
      },
      {
        name: t('services.security'),
        icon: 'ShieldCheck',
        details: t('services.securityDetails'),
        fullDescription: "Local security services and safety information to help residents and visitors stay safe in the Playa Cambutal area. Includes private security, safety consultations, and emergency response coordination.",
        contacts: [
          {
            name: "Seguridad Azuero",
            phone: "+507 6444-5555",
            type: "Private Security",
            description: "Property security, event security, and safety consultations"
          }
        ],
        emergencyNumbers: [
          {
            name: "Local Police Station",
            number: "+507 994-5432",
            description: "Tonosí Police Station (nearest to Cambutal)"
          }
        ]
      },
      {
        name: t('services.language'),
        icon: 'School',
        details: t('services.languageDetails'),
        fullDescription: "Spanish language classes and cultural exchange programs designed for expatriates and long-term visitors. Learn Spanish while experiencing Panamanian culture firsthand.",
        contacts: [
          {
            name: "Español Cambutal",
            phone: "+507 6333-7777",
            whatsapp: "+507 6333-7777",
            type: "Language School",
            description: "Group and private Spanish lessons, cultural immersion programs"
          },
          {
            name: "Maria Elena - Private Tutor",
            phone: "+507 6111-2222",
            whatsapp: "+507 6111-2222",
            type: "Private Instructor",
            description: "One-on-one Spanish tutoring, flexible scheduling"
          }
        ],
        hours: "Classes available Monday-Saturday, flexible scheduling"
      },
      {
        name: t('services.maintenance'),
        icon: 'Wrench',
        details: t('services.maintenanceDetails'),
        fullDescription: "Comprehensive property maintenance, repairs, and handyman services for homes, businesses, and vacation rentals. From plumbing and electrical work to general repairs and maintenance.",
        contacts: [
          {
            name: "Servicios Cambutal",
            phone: "+507 6888-9999",
            whatsapp: "+507 6888-9999",
            type: "General Maintenance",
            description: "Plumbing, electrical, painting, general repairs"
          },
          {
            name: "Construcciones del Pacifico",
            phone: "+507 6222-3333",
            type: "Construction & Renovation",
            description: "Larger construction projects, renovations, and major repairs"
          }
        ],
        hours: "Monday-Saturday 7:00 AM - 5:00 PM, emergency repairs 24/7"
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

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

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
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Wrench;
              
              return (
                <Card 
                  key={index} 
                  className="bg-accent/50 cursor-pointer hover:bg-accent/70 transition-colors"
                  onClick={() => handleServiceClick(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5" />
                      <h3 className="font-semibold">{service.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.details}</p>
                    <p className="text-xs text-blue-600 mt-2">Click for details →</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
      />
    </>
  );
};

export default LocalServices;
