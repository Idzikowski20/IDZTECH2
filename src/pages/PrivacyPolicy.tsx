
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import PageDotAnimation from '@/components/PageDotAnimation';
import { useTheme } from '@/utils/themeContext';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      <PageDotAnimation />
      
      <div className="container mx-auto px-4 py-20">
        <div className={`prose max-w-4xl mx-auto ${theme === 'light' ? 'prose-black' : 'prose-invert'}`}>
          <h1 className="text-4xl font-bold mb-8">{t('privacy.title')}</h1>
          <p className="mb-4">{t('privacy.lastUpdate')}: 18.05.2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.introduction.title')}</h2>
          <p>{t('privacy.introduction.content')}</p>
          <p>{t('privacy.introduction.agreement')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.contact.title')}</h2>
          <p>{t('privacy.contact.content')}</p>
          <p>IDZTECH<br/>
          E-mail: patryk.idzikowski@idztech.pl</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.dataCollection.title')}</h2>
          <p>{t('privacy.dataCollection.intro')}</p>
          <p><strong>a) {t('privacy.dataCollection.personal.title')}</strong> {t('privacy.dataCollection.personal.content')}</p>
          <p><strong>b) {t('privacy.dataCollection.technical.title')}</strong> {t('privacy.dataCollection.technical.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.dataUsage.title')}</h2>
          <p>{t('privacy.dataUsage.intro')}</p>
          <ul>
            <li>{t('privacy.dataUsage.purpose1')}</li>
            <li>{t('privacy.dataUsage.purpose2')}</li>
            <li>{t('privacy.dataUsage.purpose3')}</li>
            <li>{t('privacy.dataUsage.purpose4')}</li>
            <li>{t('privacy.dataUsage.purpose5')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.cookies.title')}</h2>
          <p>{t('privacy.cookies.description')}</p>
          <p>{t('privacy.cookies.settings')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.analytics.title')}</h2>
          <p>{t('privacy.analytics.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.sharing.title')}</h2>
          <p>{t('privacy.sharing.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.security.title')}</h2>
          <p>{t('privacy.security.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.rights.title')}</h2>
          <p>{t('privacy.rights.intro')}</p>
          <ul>
            <li>{t('privacy.rights.right1')}</li>
            <li>{t('privacy.rights.right2')}</li>
            <li>{t('privacy.rights.right3')}</li>
            <li>{t('privacy.rights.right4')}</li>
            <li>{t('privacy.rights.right5')}</li>
            <li>{t('privacy.rights.right6')}</li>
          </ul>
          <p>{t('privacy.rights.howTo')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.changes.title')}</h2>
          <p>{t('privacy.changes.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.consent.title')}</h2>
          <p>{t('privacy.consent.content')}</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
