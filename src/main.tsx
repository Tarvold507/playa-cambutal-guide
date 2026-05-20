
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if (import.meta.env.PROD) {
  // Only hydrate if this page's prerendered canonical URL matches the current path.
  // If they differ it means the SPA fallback index.html was served for an unknown route
  // and we should do a fresh client-side render to avoid hydration mismatches.
  const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const canonicalPath = canonicalLink?.href ? new URL(canonicalLink.href).pathname : null;
  const currentPath = window.location.pathname;
  const normalize = (p: string) => p.replace(/\/$/, '') || '/';
  const isMatchingPrerender =
    canonicalPath !== null && normalize(canonicalPath) === normalize(currentPath);

  if (isMatchingPrerender && rootEl.firstElementChild) {
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
} else {
  createRoot(rootEl).render(app);
}
