
import { useState, useEffect } from 'react';
import { useAdventureBusinessListings } from './useAdventureBusinessListings';

export const useDoPageLogic = () => {
  const { businesses, isLoading, error } = useAdventureBusinessListings();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Convert adventure businesses to card format
  const businessCards = businesses.map(business => {
    // Create slug from business name
    const slug = business.business_name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    
    console.log(`Business: ${business.business_name} -> Slug: ${slug}`);
    
    return {
      id: business.id,
      title: business.business_name,
      description: business.description,
      imageSrc: business.image_url || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: `/do/${slug}`,
      category: business.business_type
    };
  });

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? businessCards 
    : businessCards.filter(item => {
        // Map categories for filtering
        const categoryMap: { [key: string]: string[] } = {
          'surf': ['Surf'],
          'fitness': ['Wellness', 'Yoga Classes', 'Personal Training', 'Group Fitness', 'Wellness Retreats'],
          'tours': ['Nature', 'Wildlife Tours', 'Hiking Tours', 'Cultural Tours', 'Photography Tours'],
          'fishing': ['Water', 'Fishing Charters', 'Fishing Guides', 'Equipment Rental', 'Fishing Tours']
        };
        
        const allowedCategories = categoryMap[selectedCategory] || [];
        return allowedCategories.includes(item.category || '');
      });

  if (error) {
    console.error('Error loading adventure businesses:', error);
  }

  return {
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    isLoading,
    error
  };
};
