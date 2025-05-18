
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import { useTranslation } from 'react-i18next';

const CTA = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-premium-gradient opacity-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-premium-purple/30 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-premium-blue/30 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-premium-purple font-medium">{t('cta.startCooperation')}</span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-6">
            {t('cta.readyToIncrease')}
          </h2>
          <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'} text-lg mb-8 max-w-2xl mx-auto`}>
            {t('cta.contactUs')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                {t('buttons.freeConsultation')}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button className="border border-black text-black rounded-full px-8 py-6 transition-all duration-800 bg-transparent hover:bg-black hover:text-white dark:border-gray-200 dark:text-slate-50 dark:hover:bg-white dark:hover:text-black">
                {t('buttons.seeProjects')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
