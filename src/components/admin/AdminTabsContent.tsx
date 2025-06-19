
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import PendingEventsTab from '@/components/admin/PendingEventsTab';
import PendingBusinessesTab from '@/components/admin/PendingBusinessesTab';
import PendingRestaurantsTab from '@/components/admin/PendingRestaurantsTab';
import PendingHotelsTab from '@/components/admin/PendingHotelsTab';
import PendingBlogPostsTab from '@/components/admin/PendingBlogPostsTab';
import PendingAdventureBusinessesTab from '@/components/admin/PendingAdventureBusinessesTab';
import LiveHotelsTab from '@/components/admin/LiveHotelsTab';
import LiveRestaurantsTab from '@/components/admin/LiveRestaurantsTab';
import LiveAdventureBusinessesTab from '@/components/admin/LiveAdventureBusinessesTab';
import SEOManagementTab from '@/components/admin/SEOManagementTab';
import ContentManagementTab from '@/components/admin/ContentManagementTab';
import GooglePlacesImport from '@/components/admin/GooglePlacesImport';
import { SitemapGenerator } from './SitemapGenerator';

interface AdminTabsContentProps {
  data: {
    pendingEvents: any[];
    pendingBusinesses: any[];
    pendingRestaurants: any[];
    pendingHotels: any[];
    pendingAdventureBusinesses: any[];
    pendingBlogPosts: any[];
    liveHotels: any[];
    liveRestaurants: any[];
    liveAdventureBusinesses: any[];
    pageSEO: any[];
  };
  handlers: {
    handleApprove: (table: string, id: string) => Promise<void>;
    handleReject: (table: string, id: string) => Promise<void>;
    handleEdit: (item: any, type: string) => void;
    handleBlogApprove: (id: string) => Promise<void>;
    handleBlogReject: (id: string) => Promise<void>;
    refreshSEOData: () => void;
  };
  blogData?: {
    isLoading?: boolean;
    error?: string | null;
    refreshBlogData?: () => void;
  };
}

const AdminTabsContent = ({ data, handlers, blogData }: AdminTabsContentProps) => {
  const {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    pendingAdventureBusinesses,
    pendingBlogPosts,
    liveHotels,
    liveRestaurants,
    liveAdventureBusinesses,
    pageSEO
  } = data;

  const {
    handleApprove,
    handleReject,
    handleEdit,
    handleBlogApprove,
    handleBlogReject,
    refreshSEOData
  } = handlers;

  return (
    <div className="mt-6">
      <TabsContent value="events">
        <PendingEventsTab
          pendingEvents={pendingEvents}
          onApprove={(id) => handleApprove('events', id)}
          onEdit={(item) => handleEdit(item, 'event')}
          onReject={(id) => handleReject('events', id)}
        />
      </TabsContent>
      
      <TabsContent value="businesses">
        <PendingBusinessesTab
          pendingBusinesses={pendingBusinesses}
          onApprove={(id) => handleApprove('business_listings', id)}
          onEdit={(item) => handleEdit(item, 'business')}
          onReject={(id) => handleReject('business_listings', id)}
        />
      </TabsContent>

      <TabsContent value="restaurants">
        <PendingRestaurantsTab
          pendingRestaurants={pendingRestaurants}
          onApprove={(id) => handleApprove('restaurant_listings', id)}
          onEdit={(item) => handleEdit(item, 'restaurant')}
          onReject={(id) => handleReject('restaurant_listings', id)}
        />
      </TabsContent>

      <TabsContent value="hotels">
        <PendingHotelsTab
          pendingHotels={pendingHotels}
          onApprove={(id) => handleApprove('hotel_listings', id)}
          onEdit={(item) => handleEdit(item, 'hotel')}
          onReject={(id) => handleReject('hotel_listings', id)}
        />
      </TabsContent>

      <TabsContent value="adventure">
        <PendingAdventureBusinessesTab
          pendingAdventureBusinesses={pendingAdventureBusinesses}
          onApprove={(id) => handleApprove('adventure_business_listings', id)}
          onEdit={(item) => handleEdit(item, 'adventure')}
          onReject={(id) => handleReject('adventure_listings', id)}
        />
      </TabsContent>

      <TabsContent value="blog">
        <PendingBlogPostsTab
          pendingBlogPosts={pendingBlogPosts}
          isLoading={blogData?.isLoading}
          error={blogData?.error}
          onApprove={handleBlogApprove}
          onEdit={(item) => handleEdit(item, 'blog')}
          onReject={handleBlogReject}
          onRefresh={blogData?.refreshBlogData}
        />
      </TabsContent>

      <TabsContent value="live-hotels">
        <LiveHotelsTab
          liveHotels={liveHotels}
          onEdit={(item) => handleEdit(item, 'hotel')}
        />
      </TabsContent>

      <TabsContent value="live-restaurants">
        <LiveRestaurantsTab
          liveRestaurants={liveRestaurants}
          onEdit={(item) => handleEdit(item, 'restaurant')}
        />
      </TabsContent>

      <TabsContent value="live-adventure">
        <LiveAdventureBusinessesTab
          liveAdventureBusinesses={liveAdventureBusinesses}
          onEdit={(item) => handleEdit(item, 'adventure')}
        />
      </TabsContent>

      <TabsContent value="seo">
        <div className="space-y-6">
          <SEOManagementTab pageSEO={pageSEO} onRefresh={refreshSEOData} />
          <SitemapGenerator />
        </div>
      </TabsContent>

      <TabsContent value="content">
        <ContentManagementTab />
      </TabsContent>

      <TabsContent value="import">
        <div className="space-y-6">
          <GooglePlacesImport />
        </div>
      </TabsContent>
    </div>
  );
};

export default AdminTabsContent;
