
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageDotAnimation from '@/components/PageDotAnimation';
import { useTheme } from '@/utils/themeContext';

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      <PageDotAnimation />
      
      <div className="container mx-auto px-4 py-20">
        <div className={`prose max-w-4xl mx-auto ${theme === 'light' ? 'prose-black' : 'prose-invert'}`}>
          <h1 className="text-4xl font-bold mb-8">Polityka Prywatności</h1>
          <p className="mb-4">Ostatnia aktualizacja: 18.05.2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Wprowadzenie</h2>
          <p>IDZTECH ("my", "nas", "nasza") szanuje prywatność odwiedzających naszą stronę internetową. Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób gromadzimy, wykorzystujemy i chronimy informacje, które możesz nam przekazać podczas korzystania z naszej Strony.</p>
          <p>Korzystając z naszej Strony, wyrażasz zgodę na praktyki opisane w niniejszej Polityce Prywatności. Jeśli nie zgadzasz się z jakimkolwiek punktem niniejszej polityki, prosimy o zaprzestanie korzystania z naszej Strony.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Dane kontaktowe</h2>
          <p>W przypadku pytań dotyczących niniejszej Polityki Prywatności lub naszych praktyk związanych z danymi, prosimy o kontakt:</p>
          <p>IDZTECH<br/>
          E-mail: patryk.idzikowski@idztech.pl</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Informacje, które gromadzimy</h2>
          <p>Możemy gromadzić następujące rodzaje informacji:</p>
          <p><strong>a) Informacje osobowe:</strong> Imię i nazwisko, adres e-mail, numer telefonu oraz inne dane, które dobrowolnie nam udostępniasz poprzez formularze kontaktowe lub rejestracyjne.</p>
          <p><strong>b) Dane techniczne:</strong> Adres IP, typ i wersja przeglądarki, ustawienia strefy czasowej, rodzaje i wersje wtyczek przeglądarki, system operacyjny i platforma oraz inne technologie używane na urządzeniach, z których korzystasz, aby uzyskać dostęp do naszej Strony.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Jak wykorzystujemy Twoje informacje</h2>
          <p>Wykorzystujemy zebrane informacje do:</p>
          <ul>
            <li>Dostarczania, prowadzenia i ulepszania naszej Strony</li>
            <li>Personalizacji doświadczeń użytkownika</li>
            <li>Odpowiadania na zapytania lub prośby użytkowników</li>
            <li>Wysyłania informacji i aktualizacji dotyczących naszych usług</li>
            <li>Analizowania trendów użytkowania i działania Strony</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Pliki cookie</h2>
          <p>Nasza Strona używa plików cookie, które są małymi plikami tekstowymi umieszczanymi na Twoim urządzeniu w celu rozpoznania Twojej przeglądarki. Pliki cookie pomagają nam analizować ruch na stronie, dostosowywać naszą Stronę do potrzeb użytkowników i śledzić podstawowe informacje o użytkowniku.</p>
          <p>Możesz skonfigurować swoją przeglądarkę tak, aby odmawiała wszystkich lub niektórych plików cookie lub aby powiadamiała Cię o ich umieszczaniu. Jeżeli jednak wyłączysz pliki cookie, niektóre funkcje naszej Strony mogą nie działać prawidłowo.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Narzędzia analityczne</h2>
          <p>Używamy narzędzi analitycznych, takich jak Google Analytics, aby zrozumieć, w jaki sposób użytkownicy korzystają z naszej Strony. Te narzędzia mogą wykorzystywać pliki cookie i inne technologie do gromadzenia i analizowania informacji o Twoim korzystaniu z Strony.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Udostępnianie informacji</h2>
          <p>Nie sprzedajemy, nie handlujemy ani nie przekazujemy w inny sposób Twoich danych osobowych stronom trzecim, z wyjątkiem zaufanych stron trzecich, które pomagają nam w prowadzeniu naszej Strony, pod warunkiem, że strony te zgodzą się zachować poufność tych informacji.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Bezpieczeństwo danych</h2>
          <p>Wdrożyliśmy odpowiednie środki bezpieczeństwa, aby chronić Twoje dane osobowe przed utratą, niewłaściwym wykorzystaniem, nieautoryzowanym dostępem, ujawnieniem, zmianą lub zniszczeniem.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Twoje prawa</h2>
          <p>Zgodnie z obowiązującymi przepisami o ochronie danych, możesz mieć prawo do:</p>
          <ul>
            <li>Dostępu do swoich danych osobowych</li>
            <li>Poprawiania swoich danych osobowych</li>
            <li>Usunięcia swoich danych osobowych</li>
            <li>Sprzeciwu wobec przetwarzania swoich danych osobowych</li>
            <li>Ograniczenia przetwarzania swoich danych osobowych</li>
            <li>Przenoszenia swoich danych osobowych</li>
          </ul>
          <p>Aby skorzystać z tych praw, prosimy o kontakt za pomocą danych kontaktowych podanych powyżej.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Zmiany w Polityce Prywatności</h2>
          <p>Możemy aktualizować naszą Politykę Prywatności od czasu do czasu. Wszelkie zmiany zostaną opublikowane na tej stronie z nową datą aktualizacji. Zalecamy okresowe sprawdzanie niniejszej Polityki Prywatności w celu śledzenia ewentualnych zmian.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Zgoda</h2>
          <p>Korzystając z naszej Strony, wyrażasz zgodę na warunki niniejszej Polityki Prywatności.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
