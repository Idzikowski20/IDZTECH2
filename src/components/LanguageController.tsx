
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LanguageController: React.FC = () => {
  const location = useLocation();
  
  // Aktualizacja meta tagów
  useEffect(() => {
    // Pozyskaj deskryptory do meta tagów
    const titleTag = document.querySelector('title');
    const descriptionTag = document.querySelector('meta[name="description"]');
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    
    // Podstawowe teksty dla meta tagów
    const meta = {
      title: 'IDZTECH - Tworzymy najlepsze strony internetowe',
      description: 'IDZTECH to nowoczesne strony internetowe, aplikacje webowe i sklepy internetowe oraz profesjonalne pozycjonowanie SEO.',
    };

    if (titleTag) titleTag.textContent = meta.title;
    if (descriptionTag) descriptionTag.setAttribute('content', meta.description);
    if (ogTitleTag) ogTitleTag.setAttribute('content', meta.title);
    if (ogDescriptionTag) ogDescriptionTag.setAttribute('content', meta.description);
    
    // Ustawienie języka na Polski
    document.documentElement.lang = 'pl';
    
  }, [location.pathname]);

  return null; // Ten komponent nie renderuje nic widocznego
};

export default LanguageController;
