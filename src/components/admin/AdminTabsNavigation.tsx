
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminTabsNavigationProps {
  pendingCounts: {
    events: number;
    businesses: number;
    restaurants: number;
    hotels: number;
    adventure: number;
    blog: number;
  };
  liveCounts: {
    hotels: number;
    restaurants: number;
    adventure: number;
    blog: number;
    seo: number;
  };
}

const AdminTabsNavigation = ({ pendingCounts, liveCounts }: AdminTabsNavigationProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <TabsList className="grid w-full grid-cols-6 h-auto">
        <TabsTrigger value="events" className="text-sm">
          {t('admin.pendingEvents')} ({pendingCounts.events})
        </TabsTrigger>
        <TabsTrigger value="businesses" className="text-sm">
          {t('admin.pendingBusinesses')} ({pendingCounts.businesses})
        </TabsTrigger>
        <TabsTrigger value="restaurants" className="text-sm">
          Restaurants ({pendingCounts.restaurants})
        </TabsTrigger>
        <TabsTrigger value="hotels" className="text-sm">
          Hotels ({pendingCounts.hotels})
        </TabsTrigger>
        <TabsTrigger value="adventure" className="text-sm">
          Adventure ({pendingCounts.adventure})
        </TabsTrigger>
        <TabsTrigger value="blog" className="text-sm">
          Blog ({pendingCounts.blog})
        </TabsTrigger>
      </TabsList>
      
      <TabsList className="grid w-full grid-cols-6 h-auto">
        <TabsTrigger value="live-hotels" className="text-sm">
          Live Hotels ({liveCounts.hotels})
        </TabsTrigger>
        <TabsTrigger value="live-restaurants" className="text-sm">
          Live Restaurants ({liveCounts.restaurants})
        </TabsTrigger>
        <TabsTrigger value="live-adventure" className="text-sm">
          Live Adventure ({liveCounts.adventure})
        </TabsTrigger>
        <TabsTrigger value="live-blog" className="text-sm">
          Live Blog ({liveCounts.blog})
        </TabsTrigger>
        <TabsTrigger value="seo" className="text-sm">
          SEO ({liveCounts.seo})
        </TabsTrigger>
        <TabsTrigger value="content" className="text-sm">
          Content
        </TabsTrigger>
      </TabsList>
      
      <TabsList className="grid w-full grid-cols-1 h-auto">
        <TabsTrigger value="import" className="text-sm">
          Import
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminTabsNavigation;
