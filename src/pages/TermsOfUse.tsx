
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageDotAnimation from '@/components/PageDotAnimation';
import { useTheme } from '@/utils/themeContext';

const TermsOfUse = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      <PageDotAnimation />
      
      <div className="container mx-auto px-4 py-20">
        <div className={`prose max-w-4xl mx-auto ${theme === 'light' ? 'prose-black' : 'prose-invert'}`}>
          <h1 className="text-4xl font-bold mb-8">Warunki korzystania</h1>
          <p className="mb-4">Ostatnia aktualizacja: 18.05.2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Wprowadzenie</h2>
          <p>Niniejsze Warunki korzystania stanowią umowę między Tobą a IDZTECH ("my", "nas", "nasz") dotyczącą korzystania z naszej strony internetowej https://idztech.pl ("Strona") i świadczonych przez nas usług. Prosimy o uważne przeczytanie niniejszych Warunków korzystania przed uzyskaniem dostępu do naszej Strony lub korzystaniem z niej.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Akceptacja warunków</h2>
          <p>Uzyskując dostęp do naszej Strony lub korzystając z niej, wyrażasz zgodę na przestrzeganie niniejszych Warunków korzystania. Jeśli nie zgadzasz się z tymi warunkami, prosimy o niekorzystanie z naszej Strony.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Opis usług</h2>
          <p>IDZTECH oferuje usługi tworzenia stron internetowych, sklepów internetowych, pozycjonowania SEO i inne rozwiązania marketingu cyfrowego. Zakres i szczegóły konkretnych usług będą określone w indywidualnych umowach z klientami.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Własność intelektualna</h2>
          <p>Cała zawartość tej Strony, w tym tekst, grafika, logotypy, obrazy, audio, wideo i oprogramowanie, jest własnością IDZTECH lub jej dostawców treści i jest chroniona prawami autorskimi i prawami własności intelektualnej. Nie możesz używać, reprodukować, dystrybuować, modyfikować ani tworzyć dzieł pochodnych z jakichkolwiek treści na naszej Stronie bez naszej uprzedniej pisemnej zgody.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Treści użytkownika</h2>
          <p>Przesyłając treści na naszą Stronę (w tym między innymi komentarze, opinie lub sugestie), udzielasz IDZTECH niewyłącznej, wolnej od tantiem, bezterminowej i ogólnoświatowej licencji na używanie, powielanie, modyfikowanie, adaptowanie, publikowanie, tłumaczenie i dystrybucję takich treści w dowolnych formatach medialnych i za pośrednictwem dowolnych kanałów medialnych.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Zabronione działania</h2>
          <p>Korzystając z naszej Strony, zgadzasz się nie:</p>
          <ul>
            <li>Naruszać obowiązujących przepisów prawa</li>
            <li>Naruszać praw innych osób</li>
            <li>Używać naszej Strony do rozpowszechniania spamu, złośliwego oprogramowania lub innych szkodliwych treści</li>
            <li>Próbować zakłócać prawidłowe funkcjonowanie naszej Strony</li>
            <li>Zbierać lub pozyskiwać danych użytkowników bez pozwolenia</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Ograniczenie odpowiedzialności</h2>
          <p>IDZTECH nie ponosi odpowiedzialności za jakiekolwiek bezpośrednie, pośrednie, przypadkowe, szczególne, wynikowe lub karne szkody wynikające z dostępu do lub korzystania z, lub niemożności dostępu lub korzystania z naszej Strony lub jakichkolwiek treści na niej zawartych. Nasza Strona jest dostarczana w stanie "takim, jaki jest" i "według dostępności" bez żadnych gwarancji jakiegokolwiek rodzaju.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Wypowiedzenie</h2>
          <p>Możemy wypowiedzieć lub zawiesić Twój dostęp do naszej Strony natychmiast, bez wcześniejszego powiadomienia lub odpowiedzialności, z dowolnego powodu, w tym za naruszenie niniejszych Warunków korzystania. Po wypowiedzeniu Twoje prawo do korzystania z naszej Strony natychmiast wygasa.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Zmiany warunków</h2>
          <p>Zastrzegamy sobie prawo do modyfikacji lub zastąpienia niniejszych Warunków korzystania w dowolnym momencie. Twoim obowiązkiem jest okresowe sprawdzanie tych Warunków korzystania pod kątem zmian. Dalsze korzystanie z naszej Strony po wprowadzeniu zmian do niniejszych Warunków korzystania stanowi akceptację nowych warunków.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Prawo właściwe</h2>
          <p>Niniejsze Warunki korzystania podlegają i są interpretowane zgodnie z prawem polskim, bez względu na jego przepisy dotyczące konfliktu praw.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kontakt</h2>
          <p>Jeśli masz jakiekolwiek pytania dotyczące niniejszych Warunków korzystania, skontaktuj się z nami pod adresem patryk.idzikowski@idztech.pl.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
