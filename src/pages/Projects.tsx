
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const projectCategories = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'web', name: 'Strony WWW' },
    { id: 'ecommerce', name: 'Sklepy internetowe' },
    { id: 'seo', name: 'SEO' }
  ];
  
  const portfolioItems = [
    {
      id: 1,
      title: 'Strona firmowa dla kancelarii prawnej',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      link: '#'
    },
    {
      id: 2,
      title: 'Sklep internetowy z meblami',
      category: 'ecommerce',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      link: '#'
    },
    {
      id: 4,
      title: 'Pozycjonowanie dla firmy medycznej',
      category: 'seo',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      link: '#'
    },
    {
      id: 5,
      title: 'Strona internetowa dla restauracji',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      link: '#'
    },
    {
      id: 6,
      title: 'Sklep internetowy z kosmetykami',
      category: 'ecommerce',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80',
      link: '#'
    },
    {
      id: 8,
      title: 'Pozycjonowanie dla sklepu e-commerce',
      category: 'seo',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      link: '#'
    },
    {
      id: 9,
      title: 'Strona internetowa dla biura podróży',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
      link: '#'
    }
  ];
  
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [filteredItems, setFilteredItems] = React.useState(portfolioItems);
  
  const filterItems = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === category));
    }
  };
  
  // Initially filter items on component mount
  React.useEffect(() => {
    filterItems(activeCategory);
  }, []);
  
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-premium-purple font-medium">Nasze realizacje</span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-3 mb-6">
              Portfolio projektów <span className="bg-premium-gradient text-transparent bg-clip-text">IDZ.TECH</span>
            </h1>
            <p className="text-xl text-premium-light/70">
              Poznaj nasze najlepsze realizacje w zakresie stron internetowych, sklepów e-commerce i pozycjonowania.
            </p>
          </div>
          
          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {projectCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => filterItems(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-premium-gradient text-white' 
                    : 'bg-premium-dark/80 border border-white/10 text-premium-light/70 hover:text-premium-light hover:border-white/30'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-xl border border-white/10 animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-dark/90 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-xl font-semibold mb-2 text-premium-light">{item.title}</h3>
                  <p className="text-sm text-premium-light/70 mb-4">
                    {item.category === 'web' && 'Strona internetowa'}
                    {item.category === 'ecommerce' && 'Sklep internetowy'}
                    {item.category === 'seo' && 'Pozycjonowanie'}
                  </p>
                  <a 
                    href={item.link} 
                    className="inline-flex items-center text-premium-purple hover:text-premium-blue transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Zobacz szczegóły
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Client Success Stories */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Historie sukcesu</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Case studies naszych klientów</h2>
            <p className="text-premium-light/70 text-lg">
              Poznaj szczegółowe opisy realizowanych przez nas projektów i uzyskane dla klientów wyniki.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((item, index) => (
              <div key={index} className="bg-premium-dark/60 border border-white/10 rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                <div className="relative aspect-video">
                  <img 
                    src={`https://images.unsplash.com/photo-15${item === 1 ? '56745719' : '27519836'}-0-4d754e4e8595?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80`} 
                    alt={`Case Study ${item}`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-dark to-transparent opacity-70"></div>
                  <span className="absolute bottom-4 left-4 bg-premium-purple/90 text-white px-3 py-1 rounded text-sm">
                    {item === 1 ? 'SEO' : 'Web Development'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">
                    {item === 1 ? 'Wzrost ruchu organicznego o 320% dla firmy z branży medycznej' : 'Strona internetowa zwiększająca konwersję dla sklepu e-commerce'}
                  </h3>
                  <p className="text-premium-light/70 mb-4">
                    {item === 1 
                      ? 'Dzięki kompleksowej strategii SEO, udało nam się znacząco zwiększyć widoczność online klienta z branży medycznej, co przełożyło się na trzykrotny wzrost ruchu organicznego.' 
                      : 'Zaprojektowaliśmy i wdrożyliśmy responsywną stronę internetową zorientowaną na konwersję, co pozwoliło zwiększyć sprzedaż online o 45%.'}
                  </p>
                  <a href="#" className="inline-flex items-center text-premium-purple hover:text-premium-blue transition-colors">
                    Czytaj całe case study
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-premium-gradient opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/30 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Twój projekt</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-6">
              Zrealizuj swój projekt z IDZ.TECH
            </h2>
            <p className="text-premium-light/70 text-lg mb-8 max-w-2xl mx-auto">
              Chcesz dołączyć do grona naszych zadowolonych klientów? Skontaktuj się z nami, aby omówić szczegóły Twojego projektu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                  Darmowa konsultacja
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/about-us">
                <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10 rounded-full px-8 py-6 text-slate-50 bg-black/0">
                  Poznaj nasz zespół
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Projects;
