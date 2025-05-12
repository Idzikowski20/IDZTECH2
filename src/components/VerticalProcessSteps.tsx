
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
    <div className="flex flex-col items-center max-w-4xl mx-auto my-16">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center w-full mb-16 last:mb-0">
          {/* Step number circle - always centered */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-premium-gradient flex items-center justify-center text-white text-3xl font-bold">
              {step.number}
            </div>
          </div>
          
          {/* Line connecting to next step (except for last) */}
          {index < steps.length - 1 && (
            <div className="absolute h-16 w-0.5 bg-premium-purple/20 ml-10 mt-40"></div>
          )}
          
          {/* Content - alternating left/right placement */}
          <div className={`flex-grow px-8`}>
            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
            <p className="text-premium-light/70 text-lg">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalProcessSteps;
