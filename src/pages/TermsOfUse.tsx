
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import PageDotAnimation from '@/components/PageDotAnimation';
import { useTheme } from '@/utils/themeContext';

const TermsOfUse = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      <PageDotAnimation />
      
      <div className="container mx-auto px-4 py-28">
        <div className={`prose max-w-4xl mx-auto text-center ${theme === 'light' ? 'prose-black' : 'prose-invert'}`}>
          <h1 className="text-4xl font-bold mb-8">{t('terms.title')}</h1>
          <p className="mb-4">{t('terms.lastUpdate')}: 18.05.2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.introduction.title')}</h2>
          <p>{t('terms.introduction.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.acceptance.title')}</h2>
          <p>{t('terms.acceptance.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.services.title')}</h2>
          <p>{t('terms.services.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.intellectualProperty.title')}</h2>
          <p>{t('terms.intellectualProperty.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.userContent.title')}</h2>
          <p>{t('terms.userContent.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.prohibited.title')}</h2>
          <p>{t('terms.prohibited.intro')}</p>
          <ul className="text-left">
            <li>{t('terms.prohibited.item1')}</li>
            <li>{t('terms.prohibited.item2')}</li>
            <li>{t('terms.prohibited.item3')}</li>
            <li>{t('terms.prohibited.item4')}</li>
            <li>{t('terms.prohibited.item5')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.liability.title')}</h2>
          <p>{t('terms.liability.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.termination.title')}</h2>
          <p>{t('terms.termination.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.changes.title')}</h2>
          <p>{t('terms.changes.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.governingLaw.title')}</h2>
          <p>{t('terms.governingLaw.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.contact.title')}</h2>
          <p>{t('terms.contact.content')}</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
