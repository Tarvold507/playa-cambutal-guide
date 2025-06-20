
import React from 'react';
import { useLocation } from 'react-router-dom';
import SitemapComponent from './static/SitemapComponent';
import RobotsComponent from './static/RobotsComponent';

export const StaticFileRoutes = () => {
  const location = useLocation();
  
  if (location.pathname === '/sitemap.xml') {
    return <SitemapComponent />;
  }
  
  if (location.pathname === '/robots.txt') {
    return <RobotsComponent />;
  }
  
  return null;
};
