
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTheme } from '@/utils/themeContext';
import { Copy, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CTA from '@/components/CTA';

const PrivacyPolicyGenerator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [collectsPersonalInfo, setCollectsPersonalInfo] = useState(true);
  const [usesCookies, setUsesCookies] = useState(true);
  const [usesAnalytics, setUsesAnalytics] = useState(true);
  const [generatedPolicy, setGeneratedPolicy] = useState('');

  const generatePolicy = () => {
    if (!companyName || !websiteUrl || !email) {
      toast.error('Proszę wypełnić wszystkie wymagane pola', {
        position: 'top-center',
      });
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    
    let policy = `
POLITYKA PRYWATNOŚCI
${companyName}
${websiteUrl}

Ostatnia aktualizacja: ${currentDate}

1. WPROWADZENIE

${companyName} ("my", "nas", "nasza") szanuje prywatność odwiedzających naszą stronę internetową ${websiteUrl} ("Strona"). Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób gromadzimy, wykorzystujemy i chronimy informacje, które możesz nam przekazać podczas korzystania z naszej Strony.

Korzystając z naszej Strony, wyrażasz zgodę na praktyki opisane w niniejszej Polityce Prywatności. Jeśli nie zgadzasz się z jakimkolwiek punktem niniejszej polityki, prosimy o zaprzestanie korzystania z naszej Strony.

2. DANE KONTAKTOWE

W przypadku pytań dotyczących niniejszej Polityki Prywatności lub naszych praktyk związanych z danymi, prosimy o kontakt:

${companyName}
E-mail: ${email}
`;

    if (collectsPersonalInfo) {
      policy += `
3. INFORMACJE, KTÓRE GROMADZIMY

Możemy gromadzić następujące rodzaje informacji:

a) Informacje osobowe: Imię i nazwisko, adres e-mail, numer telefonu oraz inne dane, które dobrowolnie nam udostępniasz poprzez formularze kontaktowe lub rejestracyjne.

b) Dane techniczne: Adres IP, typ i wersja przeglądarki, ustawienia strefy czasowej, rodzaje i wersje wtyczek przeglądarki, system operacyjny i platforma oraz inne technologie używane na urządzeniach, z których korzystasz, aby uzyskać dostęp do naszej Strony.

4. JAK WYKORZYSTUJEMY TWOJE INFORMACJE

Wykorzystujemy zebrane informacje do:
- Dostarczania, prowadzenia i ulepszania naszej Strony
- Personalizacji doświadczeń użytkownika
- Odpowiadania na zapytania lub prośby użytkowników
- Wysyłania informacji i aktualizacji dotyczących naszych usług (jeśli użytkownik wyrazi na to zgodę)
- Analizowania trendów użytkowania i działania Strony
`;
    }

    if (usesCookies) {
      policy += `
5. PLIKI COOKIE

Nasza Strona używa plików cookie, które są małymi plikami tekstowymi umieszczanymi na Twoim urządzeniu w celu rozpoznania Twojej przeglądarki. Pliki cookie pomagają nam analizować ruch na stronie, dostosowywać naszą Stronę do potrzeb użytkowników i śledzić podstawowe informacje o użytkowniku.

Możesz skonfigurować swoją przeglądarkę tak, aby odmawiała wszystkich lub niektórych plików cookie lub aby powiadamiała Cię o ich umieszczaniu. Jeżeli jednak wyłączysz pliki cookie, niektóre funkcje naszej Strony mogą nie działać prawidłowo.
`;
    }

    if (usesAnalytics) {
      policy += `
6. NARZĘDZIA ANALITYCZNE

Używamy narzędzi analitycznych, takich jak Google Analytics, aby zrozumieć, w jaki sposób użytkownicy korzystają z naszej Strony. Te narzędzia mogą wykorzystywać pliki cookie i inne technologie do gromadzenia i analizowania informacji o Twoim korzystaniu z Strony. Informacje generowane przez te narzędzia dotyczące korzystania z naszej Strony są przesyłane do dostawców usług analitycznych i przechowywane na ich serwerach.
`;
    }

    policy += `
7. UDOSTĘPNIANIE INFORMACJI

Nie sprzedajemy, nie handlujemy ani nie przekazujemy w inny sposób Twoich danych osobowych stronom trzecim, z wyjątkiem zaufanych stron trzecich, które pomagają nam w prowadzeniu naszej Strony, pod warunkiem, że strony te zgodzą się zachować poufność tych informacji.

8. BEZPIECZEŃSTWO DANYCH

Wdrożyliśmy odpowiednie środki bezpieczeństwa, aby chronić Twoje dane osobowe przed utratą, niewłaściwym wykorzystaniem, nieautoryzowanym dostępem, ujawnieniem, zmianą lub zniszczeniem.

9. PRAWA UŻYTKOWNIKA

Zgodnie z obowiązującymi przepisami o ochronie danych, możesz mieć prawo do:
- Dostępu do swoich danych osobowych
- Poprawiania swoich danych osobowych
- Usunięcia swoich danych osobowych
- Sprzeciwu wobec przetwarzania swoich danych osobowych
- Ograniczenia przetwarzania swoich danych osobowych
- Przenoszenia swoich danych osobowych

Aby skorzystać z tych praw, prosimy o kontakt za pomocą danych kontaktowych podanych powyżej.

10. ZMIANY W POLITYCE PRYWATNOŚCI

Możemy aktualizować naszą Politykę Prywatności od czasu do czasu. Wszelkie zmiany zostaną opublikowane na tej stronie z nową datą aktualizacji. Zalecamy okresowe sprawdzanie niniejszej Polityki Prywatności w celu śledzenia ewentualnych zmian.

11. ZGODA

Korzystając z naszej Strony, wyrażasz zgodę na warunki niniejszej Polityki Prywatności.
`;

    setGeneratedPolicy(policy);
    toast.success('Polityka prywatności została wygenerowana!', {
      position: 'top-center',
    });
  };

  const copyToClipboard = () => {
    if (!generatedPolicy) return;
    navigator.clipboard.writeText(generatedPolicy);
    toast.success('Polityka prywatności została skopiowana do schowka!', {
      position: 'top-center',
    });
  };

  const downloadPolicy = () => {
    if (!generatedPolicy) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedPolicy], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'polityka-prywatnosci.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Helmet>
        <title>Generator Polityki Prywatności | IDZTECH</title>
        <meta name="description" content="Wygeneruj profesjonalną politykę prywatności dla swojej strony internetowej za pomocą naszego prostego narzędzia." />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Generator Polityki Prywatności</h1>
            <p className="text-lg mb-10 text-center">
              Stwórz profesjonalną politykę prywatności dla swojej strony internetowej w kilka minut.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className={`lg:col-span-2 rounded-lg p-6 ${
                theme === 'light' 
                  ? 'bg-white shadow-lg border border-gray-100' 
                  : 'bg-premium-dark/70 border border-white/10'
              }`}>
                <h2 className="text-xl font-bold mb-6">Informacje o firmie</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Nazwa firmy *</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Np. IDZTECH Sp. z o.o."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Adres strony internetowej *</label>
                    <Input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="Np. https://idztech.pl"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Adres e-mail kontaktowy *</label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Np. kontakt@idztech.pl"
                      type="email"
                      required
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold mt-6 mb-3">Ustawienia polityki</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collectsPersonalInfo" 
                      checked={collectsPersonalInfo} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setCollectsPersonalInfo(checked)
                      }}
                    />
                    <label htmlFor="collectsPersonalInfo">Zbiera dane osobowe użytkowników</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="usesCookies" 
                      checked={usesCookies} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setUsesCookies(checked)
                      }}
                    />
                    <label htmlFor="usesCookies">Używa plików cookie</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="usesAnalytics" 
                      checked={usesAnalytics} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setUsesAnalytics(checked)
                      }}
                    />
                    <label htmlFor="usesAnalytics">Używa narzędzi analitycznych</label>
                  </div>
                  
                  <Button 
                    onClick={generatePolicy}
                    className="w-full mt-6 bg-premium-gradient hover:opacity-90"
                  >
                    Generuj politykę prywatności
                  </Button>
                </div>
              </div>
              
              <div className={`lg:col-span-3 rounded-lg p-6 ${
                theme === 'light' 
                  ? 'bg-white shadow-lg border border-gray-100' 
                  : 'bg-premium-dark/70 border border-white/10'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Wygenerowana polityka</h2>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      disabled={!generatedPolicy}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Kopiuj
                    </Button>
                    <Button 
                      onClick={downloadPolicy}
                      variant="outline"
                      disabled={!generatedPolicy}
                    >
                      <Download className="mr-2 h-4 w-4" /> Pobierz
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  value={generatedPolicy}
                  readOnly
                  placeholder="Tu pojawi się wygenerowana polityka prywatności..."
                  className="h-[500px] font-mono text-sm"
                />
                
                <p className="text-sm mt-3 opacity-70">
                  Uwaga: Wygenerowana polityka prywatności jest szablonowa i może wymagać dostosowania do specyficznych potrzeb Twojej firmy. 
                  Zalecamy konsultację z prawnikiem w celu upewnienia się, że polityka jest zgodna z obowiązującymi przepisami.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      
      <Footer />
    </>
  );
};

export default PrivacyPolicyGenerator;
