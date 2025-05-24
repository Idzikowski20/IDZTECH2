import React from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const testimonials = [
  {
    id: 1,
    content: "Współpraca z IDZTECH była bardzo owocna. Dzięki ich wsparciu w zakresie SEO nasza strona zyskała na widoczności, co przełożyło się na większy ruch i zainteresowanie naszymi usługami.",
    author: "Katarzyna Mazur",
    position: "CEO, Innowacje24",
    rating: 5
  },
  {
    id: 2,
    content: "Profesjonalne podejście i rzetelna praca. Kampanie Google Ads, które dla nas przygotowali, pomogły nam dotrzeć do nowych klientów i zwiększyć sprzedaż.",
    author: "Michał Zieliński",
    position: "Marketing Manager, ModaPro",
    rating: 5
  },
  {
    id: 3,
    content: "Nowa strona internetowa, którą dla nas zaprojektowali, znacząco poprawiła wizerunek naszej firmy. Cały proces przebiegł sprawnie i zgodnie z naszymi oczekiwaniami.",
    author: "Joanna Wójcik",
    position: "Właścicielka, Stomatologia Nova",
    rating: 5
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark/60 border-white/10'} rounded-xl p-6 h-full flex flex-col`}>
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < testimonial.rating ? "fill-premium-purple text-premium-purple" : "text-gray-400"} 
          />
        ))}
      </div>
      <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/80'} flex-grow mb-6`}>"{testimonial.content}"</p>
      <div className="flex items-center mt-auto">
        <div>
          <h4 className="font-medium">{testimonial.author}</h4>
          <p className={`text-sm ${theme === 'light' ? 'text-premium-dark/70' : 'text-premium-light/60'}`}>{testimonial.position}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { theme } = useTheme();
  
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-premium-purple font-medium">Opinie klientów</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Co mówią o nas nasi klienci
            </h2>
            <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'}`}>
              Zaufało nam już ponad 10 firm z różnych branż. Poznaj opinie naszych klientów i przekonaj się, że jesteśmy właściwym wyborem dla Twojego biznesu.
            </p>
          </div>
          
          <div className="flex space-x-2 mt-6 md:mt-0">
            <button className={`w-10 h-10 rounded-full ${theme === 'light' ? 'border-gray-300' : 'border-white/10'} flex items-center justify-center hover:bg-premium-dark/80 hover:border-white/30 transition-colors`}>
              <ArrowLeft size={18} />
            </button>
            <button className={`w-10 h-10 rounded-full ${theme === 'light' ? 'border-gray-300' : 'border-white/10'} flex items-center justify-center hover:bg-premium-dark/80 hover:border-white/30 transition-colors`}>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
