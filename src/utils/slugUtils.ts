
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-+/g, '_') // Replace hyphens with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

export const findRestaurantBySlug = (slug: string, restaurantData: any) => {
  // First try to find by exact slug match (for backward compatibility)
  if (restaurantData[slug]) {
    return restaurantData[slug];
  }
  
  // Then try to find by generated slug from name
  for (const [key, restaurant] of Object.entries(restaurantData)) {
    const generatedSlug = generateSlug((restaurant as any).name);
    if (generatedSlug === slug) {
      return restaurant;
    }
  }
  
  return null;
};
