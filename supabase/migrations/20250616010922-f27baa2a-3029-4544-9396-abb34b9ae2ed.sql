
-- Insert the cards content for the home page
INSERT INTO page_content (page_path, section_name, content_type, content_data, is_visible, display_order) VALUES
('/', 'cards', 'cards', '{
  "title": "Explore Costa Rica",
  "description": "Discover the best experiences Costa Rica has to offer",
  "cards": [
    {
      "id": "1",
      "title": "Hotels & Lodging",
      "description": "Find the perfect place to stay in Costa Rica, from luxury resorts to eco-lodges",
      "imageSrc": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "link": "/stay",
      "category": "Stay"
    },
    {
      "id": "2", 
      "title": "Restaurants & Dining",
      "description": "Taste the flavors of Costa Rica at the best restaurants and local eateries",
      "imageSrc": "https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "link": "/eat",
      "category": "Eat"
    },
    {
      "id": "3",
      "title": "Surf Adventures", 
      "description": "Ride the waves at Costa Rica''s world-class surf breaks",
      "imageSrc": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "link": "/do",
      "category": "Surf"
    },
    {
      "id": "4",
      "title": "Yoga & Wellness",
      "description": "Find your zen with yoga classes and wellness retreats",
      "imageSrc": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "link": "/do",
      "category": "Do"
    },
    {
      "id": "5",
      "title": "Wildlife Adventures",
      "description": "Experience Costa Rica''s incredible biodiversity and wildlife",
      "imageSrc": "https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "link": "/do",
      "category": "Do"
    },
    {
      "id": "6",
      "title": "Transportation",
      "description": "Navigate Costa Rica with our comprehensive transportation guide",
      "imageSrc": "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "link": "/info#transportation",
      "category": "Transport"
    }
  ]
}', true, 3);
