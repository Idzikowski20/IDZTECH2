
import React from 'react';
import { useTheme } from '@/utils/themeContext';

const WhyWorkWithUs = () => {
  const { theme } = useTheme();
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-premium-purple font-medium mb-3">Dlaczego warto</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Dlaczego warto z nami pracować</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70 dark:text-premium-light/70 light:text-premium-dark/80">
            Nasza agencja zapewnia kompleksową obsługę, transparentność i realne efekty w marketingu cyfrowym.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src="/lovable-uploads/97ac4bd6-784a-468e-8520-021492b8878d.png" 
              alt="Zespół IDZ.TECH przy pracy" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className={`${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'bg-premium-dark/40 border border-premium-light/10'} rounded-xl p-4 mb-4`}>
              <h3 className="text-xl font-bold flex items-center mb-1">
                <span className="text-premium-purple mr-2">O IDZ.TECH</span>
              </h3>
              <p className="mb-4">
                Kompleksowa agencja marketingowa, która przynosi realne rezultaty
              </p>
              <p className="text-premium-light/70 dark:text-premium-light/70 light:text-premium-dark/80">
                IDZ.TECH to zespół doświadczonych specjalistów z pasją do marketingu cyfrowego. 
                Łączymy kreatywność z analitycznym podejściem, aby dostarczać rozwiązania, 
                które nie tylko wyglądają dobrze, ale przede wszystkim działają efektywnie.
              </p>
            </div>

            <div className={`${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'bg-premium-dark/40 border border-premium-light/10'} rounded-xl p-4 mb-4`}>
              <h3 className="text-xl flex items-center mb-2">
                <span className="text-premium-purple mr-2">✓</span>
                <span className="font-bold">Zorientowanie na rezultaty</span>
              </h3>
              <p className="text-premium-light/70 dark:text-premium-light/70 light:text-premium-dark/80">
                Koncentrujemy się na osiąganiu wymiernych wyników dla Twojego biznesu.
              </p>
            </div>

            <div className={`${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'bg-premium-dark/40 border border-premium-light/10'} rounded-xl p-4 mb-4`}>
              <h3 className="text-xl flex items-center mb-2">
                <span className="text-premium-purple mr-2">✓</span>
                <span className="font-bold">Transparentność działań</span>
              </h3>
              <p className="text-premium-light/70 dark:text-premium-light/70 light:text-premium-dark/80">
                Zapewniamy pełną przejrzystość i regularne raporty z naszych działań.
              </p>
            </div>

            <div className={`${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'bg-premium-dark/40 border border-premium-light/10'} rounded-xl p-4`}>
              <h3 className="text-xl flex items-center mb-2">
                <span className="text-premium-purple mr-2">✓</span>
                <span className="font-bold">Zespół ekspertów</span>
              </h3>
              <p className="text-premium-light/70 dark:text-premium-light/70 light:text-premium-dark/80">
                Nasi specjaliści posiadają certyfikaty i wieloletnie doświadczenie w branży.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-premium-purple">200+</p>
                <p className="text-sm mt-1">Zadowolonych klientów</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-premium-purple">500+</p>
                <p className="text-sm mt-1">Zrealizowanych projektów</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-premium-purple">10+</p>
                <p className="text-sm mt-1">Lat doświadczenia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-premium-purple">15+</p>
                <p className="text-sm mt-1">Ekspertów w zespole</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;
