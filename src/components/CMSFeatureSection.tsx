
import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/utils/themeContext';
import { Link } from 'react-router-dom';

const CMSFeatureSection: React.FC = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      title: "Intuicyjny edytor wizualny",
      description: "Edytuj stronę metodą drag & drop podobnie jak w Elementorze, bez znajomości kodu HTML."
    },
    {
      title: "Wygodne zarządzanie treścią",
      description: "Dodawaj, edytuj i usuwaj treści ze swojej strony w łatwy i przystępny sposób."
    },
    {
      title: "Natychmiastowy podgląd zmian",
      description: "Obserwuj efekty swoich modyfikacji w czasie rzeczywistym przed publikacją strony."
    },
    {
      title: "Elastyczne struktury stron",
      description: "Twórz różne układy stron z wykorzystaniem konfiguralnych sekcji i komponentów."
    },
    {
      title: "Wbudowane optymalizacje SEO",
      description: "Każda strona tworzona w naszym CMS jest zoptymalizowana pod kątem wyszukiwarek."
    },
    {
      title: "System zarządzania mediami",
      description: "Łatwe zarządzanie zdjęciami, filmami i innymi plikami multimedialnymi."
    },
    {
      title: "Wersjonowanie treści",
      description: "Historia zmian z możliwością przywrócenia wcześniejszych wersji strony."
    },
    {
      title: "Kontrola dostępu",
      description: "Możliwość przydzielenia różnych poziomów uprawnień dla wielu użytkowników."
    },
    {
      title: "Responsywność",
      description: "Wszystkie strony są automatycznie dostosowane do urządzeń mobilnych."
    },
    {
      title: "Integracja z mediami społecznościowymi",
      description: "Łatwe osadzanie i udostępnianie zawartości w sieciach społecznościowych."
    },
    {
      title: "Dostępność",
      description: "Zgodność z wytycznymi WCAG dla zapewnienia dostępności treści."
    },
    {
      title: "Szybkość ładowania",
      description: "Zoptymalizowana wydajność i szybkość ładowania stron."
    }
  ];

  return (
    <section className={`py-16 ${theme === 'light' ? 'bg-gray-50' : 'bg-premium-dark'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className={`text-premium-purple font-medium ${theme === 'light' ? '' : 'text-opacity-90'}`}>
            System zarządzania treścią
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Autorski system CMS podobny do Elementora
          </h2>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/70'}`}>
            Twórz i zarządzaj stroną internetową bez znajomości programowania. Nasz autorski system CMS 
            zapewnia przyjazny interfejs podobny do najpopularniejszych rozwiązań jak Elementor w WordPressie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-lg border transform transition-all duration-300 hover:shadow-lg 
                ${theme === 'light' 
                  ? 'bg-white border-gray-200 hover:border-premium-purple/30' 
                  : 'bg-premium-dark/50 border-premium-light/10 hover:border-premium-purple/30'}`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle 
                    className={`h-6 w-6 ${theme === 'light' ? 'text-premium-purple' : 'text-premium-purple'}`}
                  />
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kontakt">
              <Button 
                className="bg-premium-gradient hover:bg-premium-purple/80 transition-colors text-white px-8 py-3 rounded-full"
              >
                Zapytaj o nasz system CMS
              </Button>
            </Link>
            <Link to="/projekty">
              <Button 
                variant="outline"
                className={`px-8 py-3 rounded-full border ${
                  theme === 'light' 
                    ? 'border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-black' 
                    : 'border-premium-light/20 text-white hover:bg-white hover:text-black'
                }`}
              >
                Zobacz nasze realizacje
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CMSFeatureSection;
