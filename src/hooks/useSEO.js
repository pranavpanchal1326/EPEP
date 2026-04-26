import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSEO = ({ title, description }) => {
  const location = useLocation();
  const canonicalUrl = 'https://epep.vercel.app' + location.pathname;

  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }, [title, description, canonicalUrl]);
};