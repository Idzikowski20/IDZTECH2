
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Edit, Save, Globe, Settings, User, Layers, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const CMSGuide: React.FC = () => {
  const { theme } = useTheme();

  const steps = [
    {
      title: "Logowanie do panelu administracyjnego",
      description: "Zaloguj się do panelu administracyjnego używając swoich danych dostępowych (email i hasło) na stronie /admin.",
      icon: <User className="h-10 w-10 text-premium-blue" />
    },
    {
      title: "Przejście do sekcji CMS",
      description: "Po zalogowaniu, przejdź do zakładki 'CMS Panel' w menu bocznym panelu administracyjnego.",
      icon: <Layers className="h-10 w-10 text-premium-blue" />
    },
    {
      title: "Wybór strony do edycji",
      description: "Z listy dostępnych stron wybierz tę, którą chcesz edytować, klikając na jej nazwę w lewym panelu.",
      icon: <FileText className="h-10 w-10 text-premium-blue" />
    },
    {
      title: "Wybór sekcji do edycji",
      description: "Każda strona składa się z kilku sekcji (np. Hero, O nas, Usługi). Wybierz sekcję, którą chcesz edytować.",
      icon: <Layers className="h-10 w-10 text-premium-blue" />
    },
    {
      title: "Edycja treści",
      description: "Możesz edytować treść w edytorze wizualnym lub w formacie HTML, w zależności od preferencji.",
      icon: <Edit className="h-10 w-10 text-premium-blue" />
    },
    {
      title: "Zapisanie zmian",
      description: "Po zakończeniu edycji, kliknij przycisk 'Zapisz zmiany', aby zastosować wprowadzone modyfikacje.",
      icon: <Save className="h-10 w-10 text-premium-blue" />
    },
    {
      title: "Podgląd strony",
      description: "Możesz podejrzeć wprowadzone zmiany, klikając przycisk 'Podgląd' w górnej części panelu.",
      icon: <Globe className="h-10 w-10 text-premium-blue" />
    }
  ];

  return (
    <Card className={`p-8 ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/60 border border-white/10'}`}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Jak korzystać z systemu CMS</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Przewodnik krok po kroku, jak zarządzać treścią na Twojej stronie
        </p>
      </div>

      <div className="space-y-6 mt-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-premium-purple/10' : 'bg-premium-purple/30'}`}>
              {step.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
        <h3 className="font-semibold mb-4">Dostęp do panelu CMS</h3>
        <p className="mb-4">
          Aby uzyskać dostęp do panelu CMS, przejdź do strony:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono text-sm mb-6">
          https://idz.tech/admin/cms
        </div>
        <Link to="/admin/cms">
          <Button className="bg-premium-gradient text-white">
            Przejdź do panelu CMS
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
        <h3 className="font-semibold mb-4">Wymagania techniczne</h3>
        <p className="mb-2">
          System CMS działa optymalnie na następujących przeglądarkach:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-6">
          <li>Google Chrome (najnowsza wersja)</li>
          <li>Mozilla Firefox (najnowsza wersja)</li>
          <li>Microsoft Edge (najnowsza wersja)</li>
          <li>Safari (najnowsza wersja)</li>
        </ul>
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-md flex items-start">
          <Code className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Uwaga dla zaawansowanych użytkowników</p>
            <p className="text-sm">
              Przy edycji kodu HTML należy zachować ostrożność, aby nie uszkodzić struktury strony. W razie problemów skontaktuj się z administratorem systemu.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CMSGuide;
