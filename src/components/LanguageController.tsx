
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const LanguageController: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  
  // Aktualizacja meta tagów w zależności od języka
  useEffect(() => {
    // Pozyskaj deskryptory do meta tagów
    const titleTag = document.querySelector('title');
    const descriptionTag = document.querySelector('meta[name="description"]');
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    
    // Podstawowe tłumaczenia dla meta tagów
    const pageMeta = {
      pl: {
        title: 'IDZTECH - Tworzymy najlepsze strony internetowe',
        description: 'IDZTECH to nowoczesne strony internetowe, aplikacje webowe i sklepy internetowe oraz profesjonalne pozycjonowanie SEO.',
      },
      en: {
        title: 'IDZTECH - We create the best websites',
        description: 'IDZTECH offers modern websites, web applications, online stores and professional SEO positioning.',
      },
      de: {
        title: 'IDZTECH - Wir erstellen die besten Webseiten',
        description: 'IDZTECH bietet moderne Webseiten, Webanwendungen, Online-Shops und professionelle SEO-Positionierung.',
      },
      fr: {
        title: 'IDZTECH - Nous créons les meilleurs sites web',
        description: 'IDZTECH propose des sites web modernes, des applications web, des boutiques en ligne et un référencement SEO professionnel.',
      },
      es: {
        title: 'IDZTECH - Creamos los mejores sitios web',
        description: 'IDZTECH ofrece sitios web modernos, aplicaciones web, tiendas online y posicionamiento SEO profesional.',
      }
    };

    // Aktualizacja meta tagów
    const currentLanguage = i18n.language.split('-')[0] as keyof typeof pageMeta; // pl, en, de, fr, es
    const defaultLanguage = 'pl' as keyof typeof pageMeta;
    const meta = pageMeta[currentLanguage] || pageMeta[defaultLanguage];

    if (titleTag) titleTag.textContent = meta.title;
    if (descriptionTag) descriptionTag.setAttribute('content', meta.description);
    if (ogTitleTag) ogTitleTag.setAttribute('content', meta.title);
    if (ogDescriptionTag) ogDescriptionTag.setAttribute('content', meta.description);
    
    // Aktualizacja znacznika języka na stronie
    document.documentElement.lang = currentLanguage;
    
  }, [i18n.language, location.pathname]);

  return null; // Ten komponent nie renderuje nic widocznego
};

export default LanguageController;
