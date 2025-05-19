import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

const PrivacyPolicyGenerator = () => {
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [generatedPolicy, setGeneratedPolicy] = useState('');

  const generatePolicy = () => {
    if (!companyName || !websiteUrl || !email) {
      toast.error('Proszę wypełnić wszystkie pola');
      return;
    }

    const policy = `Polityka Prywatności

1. Informacje ogólne
Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem przez nich z serwisu ${websiteUrl} (dalej "Serwis").

2. Administratorem danych osobowych zawartych w Serwisie jest:
${companyName}
Email: ${email}

3. Cele przetwarzania danych osobowych
Dane osobowe przetwarzane są w celu:
- świadczenia usług drogą elektroniczną
- obsługi zapytań kierowanych przez formularz kontaktowy
- realizacji zamówień
- prowadzenia działań marketingowych

4. Podstawa przetwarzania danych
Przetwarzanie danych osobowych odbywa się na podstawie:
- zgody wyrażonej przez Użytkownika
- konieczności wykonania umowy, której stroną jest Użytkownik
- obowiązku prawnego ciążącego na Administratorze
- prawnie uzasadnionych interesów realizowanych przez Administratora

5. Prawa Użytkownika
Użytkownik ma prawo do:
- dostępu do swoich danych osobowych
- sprostowania danych osobowych
- usunięcia danych osobowych
- ograniczenia przetwarzania danych osobowych
- przenoszenia danych osobowych
- wniesienia sprzeciwu wobec przetwarzania danych osobowych
- cofnięcia zgody na przetwarzanie danych osobowych

6. Okres przechowywania danych
Dane osobowe będą przechowywane przez okres niezbędny do realizacji celów, w których zostały zebrane, w tym do wypełnienia obowiązków prawnych ciążących na Administratorze.

7. Bezpieczeństwo danych
Administrator dokłada wszelkich starań, aby zapewnić odpowiednie środki bezpieczeństwa danych osobowych, w tym ochronę przed ich udostępnieniem osobom nieupoważnionym, zabraniem przez osobę nieuprawnioną, przetwarzaniem z naruszeniem obowiązujących przepisów oraz zmianą, utratą, uszkodzeniem lub zniszczeniem.

8. Pliki cookies
Serwis korzysta z plików cookies. Użytkownik może określić warunki przechowywania lub dostępu do plików cookies za pomocą ustawień przeglądarki.

9. Zmiany w polityce prywatności
Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności. Wszelkie zmiany wchodzą w życie z chwilą ich opublikowania w Serwisie.

10. Kontakt
W sprawach związanych z przetwarzaniem danych osobowych można kontaktować się z Administratorem pod adresem email: ${email}`;

    setGeneratedPolicy(policy);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPolicy);
    toast.success('Skopiowano do schowka');
  };

  const downloadPolicy = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedPolicy], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'polityka-prywatnosci.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Generator Polityki Prywatności</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nazwa firmy</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Wprowadź nazwę firmy"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Adres strony internetowej</label>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="np. https://www.example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email kontaktowy</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kontakt@example.com"
              />
            </div>
            
            <Button onClick={generatePolicy} className="w-full">
              Generuj politykę prywatności
            </Button>
          </div>
        </Card>

        {generatedPolicy && (
          <Card className="p-6">
            <div className="space-y-4">
              <Textarea
                value={generatedPolicy}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
              
              <div className="flex gap-4">
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Kopiuj
                </Button>
                <Button onClick={downloadPolicy} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Pobierz
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyGenerator;
