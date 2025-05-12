
import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const VerticalProcessSteps = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Analiza branży",
      description: "Przeprowadzamy dogłębną analizę branży i konkurencji, aby zidentyfikować kluczowe elementy."
    },
    {
      number: 2,
      title: "Planowanie treści",
      description: "Tworzymy szczegółowy plan treści z nagłówkami i podtytułami dostosowany do potrzeb SEO."
    },
    {
      number: 3,
      title: "Struktura linków",
      description: "Planujemy nawigację, menu i linkowanie wewnętrzne dla optymalnej struktury strony."
    },
    {
      number: 4,
      title: "Projekt wizualny",
      description: "Opracowujemy unikalny design dopasowany do Twojej marki i celów biznesowych."
    },
    {
      number: 5,
      title: "Tworzenie treści",
      description: "Tworzymy angażujące i zoptymalizowane pod SEO treści, które odpowiadają na potrzeby użytkowników."
    },
    {
      number: 6,
      title: "Optymalizacja SEO",
      description: "Wdrażamy zaawansowane techniki SEO, aby zwiększyć widoczność w wyszukiwarkach."
    },
    {
      number: 7,
      title: "Uruchomienie strony",
      description: "Przenosimy gotową stronę na serwer produkcyjny i przeprowadzamy finalne testy."
    }
  ];

  return (
    <div className="flex flex-col space-y-8">
      {steps.map((step, index) => (
        <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Step number - always visible */}
          <div className="flex-shrink-0 flex justify-center">
            <div className={`w-16 h-16 rounded-full bg-premium-gradient flex items-center justify-center text-white text-2xl font-bold z-10`}>
              {step.number}
            </div>
          </div>
          
          {/* Content - aligned left or right based on index */}
          <div className={`flex-grow px-6 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-premium-light/70">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalProcessSteps;
