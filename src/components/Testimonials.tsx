
import React from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "Współpraca z Premium Digital była strzałem w dziesiątkę dla naszej firmy. Dzięki ich strategii SEO zwiększyliśmy ruch na stronie o 150% w ciągu zaledwie 6 miesięcy.",
    author: "Marek Kowalski",
    position: "CEO, Tech Solutions",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
  {
    id: 2,
    content: "Profesjonalizm na najwyższym poziomie. Kampanie Google Ads przygotowane przez Premium Digital znacząco zwiększyły nasze konwersje i obniżyły koszt pozyskania klienta.",
    author: "Anna Nowak",
    position: "Marketing Manager, Fashion Store",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
  {
    id: 3,
    content: "Nowa strona internetowa zaprojektowana przez Premium Digital znacząco poprawiła wizerunek naszej firmy. Cały proces przebiegł sprawnie i zgodnie z naszymi oczekiwaniami.",
    author: "Tomasz Wiśniewski",
    position: "Właściciel, Dental Clinic",
    rating: 5,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full flex flex-col">
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < testimonial.rating ? "fill-premium-purple text-premium-purple" : "text-gray-400"} 
          />
        ))}
      </div>
      <p className="text-premium-light/80 flex-grow mb-6">"{testimonial.content}"</p>
      <div className="flex items-center mt-auto">
        <img 
          src={testimonial.image} 
          alt={testimonial.author} 
          className="w-12 h-12 rounded-full object-cover mr-4" 
        />
        <div>
          <h4 className="font-medium">{testimonial.author}</h4>
          <p className="text-sm text-premium-light/60">{testimonial.position}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-premium-purple font-medium">Opinie klientów</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Co mówią o nas nasi klienci
            </h2>
            <p className="text-premium-light/70">
              Zaufało nam już ponad 200 firm z różnych branż. Poznaj opinie naszych klientów i przekonaj się, że jesteśmy właściwym wyborem dla Twojego biznesu.
            </p>
          </div>
          
          <div className="flex space-x-2 mt-6 md:mt-0">
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-premium-dark/80 hover:border-white/30 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-premium-dark/80 hover:border-white/30 transition-colors">
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
