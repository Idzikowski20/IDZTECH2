
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import PageDotAnimation from '@/components/PageDotAnimation';
import { useNavigate } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VerticalProcessSteps from '@/components/VerticalProcessSteps';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';
import { JavaScript, Css3, Html5, TypeScript, ReactIcon } from 'lucide-react';

const WebDevelopment = () => {
  const navigate = useNavigate();

  const features = [
    "Projektowanie responsywnych stron internetowych",
    "Optymalizacja szybkości ładowania strony",
    "Intuicyjny interfejs użytkownika",
    "Integracja z mediami społecznościowymi",
    "Konfiguracja Google Analytics",
    "Systemy zarządzania treścią (CMS)",
    "Formularze kontaktowe i mapy",
    "Projektowanie UX/UI",
    "SEO on-page",
    "Pomoc techniczna po wdrożeniu"
  ];

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <PageDotAnimation />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ServiceBreadcrumb 
                items={[
                  { label: 'Strona główna', href: '/' },
                  { label: 'Usługi', href: '#services' },
                  { label: 'Tworzenie stron internetowych', href: '/tworzenie-stron-www' }
                ]} 
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-8 mb-6">
                Tworzenie stron <span className="text-transparent bg-clip-text bg-premium-gradient">internetowych</span>
              </h1>
              <p className="text-xl text-premium-light/70 mb-8 max-w-2xl">
                Tworzymy nowoczesne, responsywne i zoptymalizowane strony internetowe, które 
                pomagają osiągać cele biznesowe i wyróżniać się na tle konkurencji.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/kontakt')} 
                  className="px-8 py-6 bg-premium-gradient"
                  size="lg"
                >
                  Zamów bezpłatną wycenę
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-6"
                  size="lg"
                  onClick={() => navigate('/portfolio')}
                >
                  Zobacz portfolio
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-full h-auto overflow-hidden rounded-lg">
                <iframe 
                  style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }} 
                  width="100%" 
                  height={window.innerWidth < 768 ? "300" : "450"} 
                  src="https://embed.figma.com/design/SWlCEN5VCx37JgFZiVndkY/Macbook-Pro---Air-Device-Mockups--Community-?node-id=1-6&embed-host=share" 
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 bg-premium-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-premium-purple font-medium mb-3">Co oferujemy</p>
            <h2 className="text-3xl md:text-4xl font-bold">Tworzenie stron internetowych</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70">
              Oferujemy kompleksowe usługi tworzenia stron internetowych, które są nie tylko 
              atrakcyjne wizualnie, ale również funkcjonalne i zoptymalizowane.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-premium-dark/60 border border-premium-light/10 rounded-xl p-8 hover:transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Strony WWW</h3>
              <p className="text-premium-light/70 mb-4">
                Profesjonalne strony internetowe, które wyróżnią Twoją firmę w sieci i zwiększą konwersję.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Nowoczesny design</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Responsywność na wszystkich urządzeniach</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Przyjazne dla SEO</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-premium-dark/60 border border-premium-light/10 rounded-xl p-8 hover:transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Strony firmowe</h3>
              <p className="text-premium-light/70 mb-4">
                Profesjonalna wizytówka Twojej firmy w internecie z możliwością łatwej edycji treści.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Profesjonalna prezentacja oferty</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Łatwy system zarządzania treścią</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Formularze kontaktowe i mapy</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-premium-dark/60 border border-premium-light/10 rounded-xl p-8 hover:transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Landing pages</h3>
              <p className="text-premium-light/70 mb-4">
                Skuteczne strony docelowe, zoptymalizowane pod kątem konwersji i generowania leadów.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Przekonująca struktura sprzedażowa</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Efektywne elementy call-to-action</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>A/B testing dla zwiększenia konwersji</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Technologie</h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              W czym tworzymy strony internetowe?
            </p>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-black/70">
              Korzystamy z najnowszych technologii, aby zapewnić Ci szybką, bezpieczną i funkcjonalną stronę internetową.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 48 48">
                  <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
                  <path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path>
                </svg>
              </div>
              <p className="font-medium text-black">JavaScript</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 48 48">
                  <linearGradient id="TQDriqswrKwPOniLrPT12a_7gdY5qNXaKC0_gr1" x1="16.33" x2="32.293" y1="-2.748" y2="41.109" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#2aa4f4"></stop>
                    <stop offset="1" stop-color="#007ad9"></stop>
                  </linearGradient>
                  <path fill="url(#TQDriqswrKwPOniLrPT12a_7gdY5qNXaKC0_gr1)" d="M7.192,7.176l2.627,29.77c0.109,1.237,0.97,2.28,2.164,2.621l10.643,3.041	c0.898,0.257,1.849,0.257,2.747,0l10.643-3.041c1.194-0.341,2.055-1.383,2.164-2.621l2.627-29.77C40.911,6.006,39.99,5,38.816,5	H9.184C8.01,5,7.089,6.006,7.192,7.176z"></path>
                  <path fill="#35c1f1" d="M24,8v31.9l9.876-2.822c0.797-0.228,1.371-0.924,1.443-1.749l2.286-26.242	C37.656,8.502,37.196,8,36.609,8H24z"></path>
                  <path fill="#fff" d="M33.1,13H24v4h4.9l-0.3,4H24v4h4.4l-0.3,4.5L24,30.9v4.2l7.9-2.6L32.6,21l0,0L33.1,13z"></path>
                  <path fill="#d6e0e9" d="M24,13v4h-8.9l-0.3-4H24z M19.4,21l0.2,4H24v-4H19.4z M19.8,27h-4l0.3,5.5l7.9,2.6v-4.2l-4.1-1.4	L19.8,27z"></path>
                  <path d="M33.1,13l-0.5,8l-0.7,11.5L24,35.1l-7.9-2.6L15.8,27h4l0.1,2.5l4.1,1.4l4.1-1.4l0.3-4.5H24h-4.4l-0.2-4H24h4.6l0.3-4H24 h-8.9l-0.3-4H24H33.1 M34.164,12H33.1H24h-9.2h-1.078l0.081,1.075l0.3,4L14.172,18H15.1H24h3.822l-0.15,2H24h-4.6h-1.051 l0.052,1.05l0.2,4L18.649,26H15.8h-1.056l0.058,1.054l0.3,5.5l0.037,0.682l0.649,0.214l7.9,2.6L24,36.153l0.313-0.103l7.9-2.6 l0.644-0.212l0.041-0.677l0.7-11.5l0.5-7.998L34.164,12L34.164,12z M20.761,26H24h3.331l-0.185,2.769L24,29.843l-3.128-1.068 l-0.073-1.815L20.761,26L20.761,26z" opacity=".05"></path>
                  <path d="M33.1,13l-0.5,8l-0.7,11.5L24,35.1l-7.9-2.6L15.8,27h4l0.1,2.5l4.1,1.4l4.1-1.4l0.3-4.5H24h-4.4l-0.2-4H24h4.6l0.3-4H24 h-8.9l-0.3-4H24H33.1 M33.632,12.5H33.1H24h-9.2h-0.539l0.04,0.537l0.3,4l0.035,0.463H15.1H24h4.361l-0.225,3H24h-4.6h-0.526 l0.026,0.525l0.2,4l0.024,0.475H19.6H24h3.866l-0.242,3.634L24,30.372l-3.614-1.234L20.3,26.98L20.28,26.5H19.8h-4h-0.528 l0.029,0.527l0.3,5.5l0.019,0.341l0.324,0.107l7.9,2.6L24,35.626l0.156-0.051l7.9-2.6l0.322-0.106l0.021-0.339l0.7-11.5l0.5-7.999 L33.632,12.5L33.632,12.5z" opacity=".07"></path>
                </svg>
              </div>
              <p className="font-medium text-black">CSS3</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 48 48">
                  <path fill="#E65100" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
                  <path fill="#FF6D00" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
                  <path fill="#FFF" d="M24,25v-4h8.6l-0.7,11.5L24,35.1v-4.2l4.1-1.4l0.3-4.5H24z M32.9,17l0.3-4H24v4H32.9z"></path>
                  <path fill="#EEE" d="M24,30.9v4.2l-7.9-2.6L15.7,27h4l0.2,2.5L24,30.9z M19.1,17H24v-4h-9.1l0.7,12H24v-4h-4.6L19.1,17z"></path>
                </svg>
              </div>
              <p className="font-medium text-black">HTML5</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3">
                <svg viewBox="0 0 32 32" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="28" height="28" rx="1.312" style="fill:#3178c6"></rect>
                  <path d="M18.245,23.759v3.068a6.492,6.492,0,0,0,1.764.575,11.56,11.56,0,0,0,2.146.192,9.968,9.968,0,0,0,2.088-.211,5.11,5.11,0,0,0,1.735-.7,3.542,3.542,0,0,0,1.181-1.266,4.469,4.469,0,0,0,.186-3.394,3.409,3.409,0,0,0-.717-1.117,5.236,5.236,0,0,0-1.123-.877,12.027,12.027,0,0,0-1.477-.734q-.6-.249-1.08-.484a5.5,5.5,0,0,1-.813-.479,2.089,2.089,0,0,1-.516-.518,1.091,1.091,0,0,1-.181-.618,1.039,1.039,0,0,1,.162-.571,1.4,1.4,0,0,1,.459-.436,2.439,2.439,0,0,1,.726-.283,4.211,4.211,0,0,1,.956-.1,5.942,5.942,0,0,1,.808.058,6.292,6.292,0,0,1,.856.177,5.994,5.994,0,0,1,.836.3,4.657,4.657,0,0,1,.751.422V13.9a7.509,7.509,0,0,0-1.525-.4,12.426,12.426,0,0,0-1.9-.129,8.767,8.767,0,0,0-2.064.235,5.239,5.239,0,0,0-1.716.733,3.655,3.655,0,0,0-1.171,1.271,3.731,3.731,0,0,0-.431,1.845,3.588,3.588,0,0,0,.789,2.34,6,6,0,0,0,2.395,1.639q.63.26,1.175.509a6.458,6.458,0,0,1,.942.517,2.463,2.463,0,0,1,.626.585,1.2,1.2,0,0,1,.23.719,1.1,1.1,0,0,1-.144.552,1.269,1.269,0,0,1-.435.441,2.381,2.381,0,0,1-.726.292,4.377,4.377,0,0,1-1.018.105,5.773,5.773,0,0,1-1.969-.35A5.874,5.874,0,0,1,18.245,23.759Zm-5.154-7.638h4V13.594H5.938v2.527H9.92V27.375h3.171Z" style="fill:#ffffff;fill-rule:evenodd"></path>
                </svg>
              </div>
              <p className="font-medium text-black">TypeScript</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3">
                <svg viewBox="0 0 64 64" width="64" height="64" version="1.1" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                  <circle cx="32.001" cy="31.955" r="4.478" style="fill:#00d8ff;"></circle>
                  <path d="M32.33,22.516c7.635,0.052 15.965,0.609 21.683,5.708c0.168,0.15 0.33,0.306 0.488,0.467c1.349,1.375 2.054,3.595 0.965,5.422c-2.234,3.751 -7.23,5.387 -12.067,6.394c-7.234,1.506 -14.798,1.518 -22.029,0.192c-4.161,-0.764 -8.416,-2.103 -11.373,-4.904c-1.151,-1.09 -2.135,-2.524 -1.981,-4.12c0.25,-2.582 2.727,-4.239 4.812,-5.361c5.791,-3.116 12.847,-3.813 19.502,-3.798Zm-0.554,1.173c-7.224,0.049 -15.043,0.51 -20.621,5.129c-0.195,0.161 -0.383,0.33 -0.564,0.507c-0.117,0.114 -0.23,0.233 -0.339,0.355c-0.979,1.1 -1.316,2.867 -0.392,4.188c0.93,1.329 2.342,2.288 3.796,3.07c5.438,2.924 11.864,3.443 18.129,3.465c6.343,0.023 12.884,-0.555 18.487,-3.452c2.232,-1.155 4.744,-2.851 4.655,-5.035c-0.082,-2.004 -2.036,-3.242 -3.499,-4.126c-0.396,-0.239 -0.803,-0.46 -1.216,-0.668c-5.562,-2.787 -12.08,-3.447 -18.436,-3.433Z" style="fill:#00d8ff;"></path>
                  <path d="M42.115,10.703c2.793,0.071 4.24,3.429 4.431,5.909c0.038,0.493 0.052,0.988 0.046,1.483c-0.006,0.536 -0.035,1.072 -0.082,1.606c-0.589,6.612 -3.608,12.909 -7.163,18.724c-3.477,5.688 -7.717,11.36 -13.485,13.996c-1.907,0.872 -4.175,1.41 -5.863,0.437c-2.314,-1.333 -2.567,-4.451 -2.524,-6.816c0.011,-0.581 0.049,-1.162 0.109,-1.741c0.889,-8.56 5.228,-16.669 10.658,-23.655c3.168,-4.076 6.937,-8.119 11.632,-9.583c0.739,-0.231 1.326,-0.371 2.241,-0.36Zm-0.134,1.172c-3.279,0.052 -6.223,2.482 -8.83,5.007c-6.854,6.637 -11.905,15.464 -13.937,24.721c-0.157,0.717 -0.289,1.439 -0.386,2.166c-0.075,0.563 -0.13,1.129 -0.159,1.697c-0.023,0.452 -0.031,0.905 -0.017,1.358c0.01,0.354 0.033,0.708 0.072,1.06c0.029,0.269 0.068,0.537 0.117,0.803c0.037,0.197 0.08,0.393 0.13,0.588c0.041,0.158 0.087,0.315 0.139,0.471c0.409,1.233 1.463,2.411 2.878,2.45c3.301,0.09 6.409,-2.317 9.096,-4.933c4.717,-4.591 8.232,-10.36 10.978,-16.424c2.216,-4.896 4.243,-10.218 3.111,-15.607c-0.043,-0.204 -0.093,-0.406 -0.15,-0.606c-0.047,-0.163 -0.1,-0.324 -0.158,-0.483c-0.44,-1.199 -1.475,-2.271 -2.884,-2.268Z" style="fill:#00d8ff;"></path>
                  <path d="M22.109,10.747c3.564,0.069 6.765,2.488 9.607,5.197c5.186,4.943 9.011,11.231 11.913,17.849c2.248,5.127 4.316,10.882 2.478,16.292c-0.579,1.705 -2.044,3.265 -3.997,3.305c-3.581,0.072 -6.9,-2.532 -9.78,-5.335c-7.225,-7.034 -12.589,-16.32 -14.427,-26.168c-0.132,-0.704 -0.237,-1.414 -0.309,-2.127c-0.059,-0.582 -0.096,-1.167 -0.106,-1.752c-0.008,-0.472 0.002,-0.944 0.035,-1.414c0.022,-0.314 0.054,-0.626 0.097,-0.937c0.041,-0.292 0.093,-0.583 0.158,-0.871c0.043,-0.191 0.091,-0.38 0.146,-0.568c0.539,-1.843 1.941,-3.485 4.185,-3.471Zm-0.135,1.173c-2.087,0.046 -3.042,2.507 -3.234,4.234c-0.039,0.354 -0.063,0.711 -0.074,1.068c-0.014,0.456 -0.008,0.913 0.015,1.369c0.328,6.599 3.278,12.979 6.838,18.821c3.352,5.5 7.4,10.978 12.968,13.794c1.608,0.813 3.562,1.452 4.951,0.684c1.742,-0.964 1.956,-3.261 2.049,-4.973c0.025,-0.466 0.028,-0.934 0.013,-1.401c-0.018,-0.586 -0.064,-1.171 -0.133,-1.753c-0.642,-5.437 -3.05,-10.582 -5.816,-15.444c-3.442,-6.048 -7.659,-12.076 -13.627,-15.225c-1.236,-0.652 -2.574,-1.185 -3.95,-1.174Z" style="fill:#00d8ff;"></path>
                </svg>
              </div>
              <p className="font-medium text-black">React</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-premium-purple font-medium mb-3">Proces tworzenia</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kroki do stworzenia strony internetowej</h2>
            <p className="text-lg max-w-3xl mx-auto text-premium-light/70">
              Poznaj etapy tworzenia skutecznej strony internetowej, która będzie wspierać Twój biznes.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <VerticalProcessSteps />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-premium-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-premium-purple font-medium mb-3">Co otrzymasz</p>
            <h2 className="text-3xl md:text-4xl font-bold">Funkcjonalności stron internetowych</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="w-6 h-6 rounded-full bg-premium-gradient flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
                <p className="text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-premium-purple font-medium mb-3">Plan działania</p>
            <h2 className="text-3xl md:text-4xl font-bold">Agenda</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70">
              Poznaj szczegółowy plan działania, który realizujemy dla każdego projektu strony internetowej.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>1. Analiza i strategia</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Określenie celów biznesowych strony</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Analiza konkurencji i rynku</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Określenie grupy docelowej</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Strategia pozycjonowania</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>2. Projektowanie UX/UI</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Wireframing i prototypowanie</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Projektowanie interfejsu użytkownika</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja ścieżek użytkownika</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Design responsywny</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>3. Implementacja i rozwój</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Kodowanie frontendu i backendu</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Implementacja CMS</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja wydajności</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Testowanie funkcjonalności</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>4. SEO i treści</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja on-page SEO</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Tworzenie treści zorientowanych na konwersję</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja meta tagów</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Analiza słów kluczowych</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>5. Wdrożenie i testy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Konfiguracja serwera i domeny</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Testowanie użyteczności</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Testowanie na różnych urządzeniach</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Audyt przed publikacją</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>6. Wsparcie i rozwój</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Regularne aktualizacje</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Monitorowanie wydajności</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Analityka i raportowanie</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Ciągłe doskonalenie</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Gotowy na profesjonalną stronę internetową?</h2>
          <p className="text-xl text-black/70 mb-8 max-w-3xl mx-auto">
            Skontaktuj się z nami już dziś i rozpocznijmy pracę nad Twoją nową stroną,
            która będzie przyciągać klientów i zwiększać sprzedaż.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/kontakt')} 
              className="px-8 py-6 bg-premium-gradient"
              size="lg"
            >
              Skontaktuj się z nami
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-6 hover:bg-black hover:text-white"
              size="lg"
              onClick={() => navigate('/portfolio')}
            >
              Zobacz nasze realizacje
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebDevelopment;
