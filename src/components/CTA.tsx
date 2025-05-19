import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const CTA = () => {
  const { theme } = useTheme();

  return (
    <section className="py-16 bg-premium-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Gotowy na transformację cyfrową?
          </h2>
          <p className="text-lg mb-8 text-premium-light/70">
            Dołącz do społeczności Premium Digital Harvest i odkryj potencjał nowoczesnego marketingu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-premium-gradient hover:scale-105 transition-transform">
              <Link to="/register">
                Rozpocznij teraz <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-premium-light/20 text-white hover:bg-premium-light/10">
              <Link to="/blog">Dowiedz się więcej</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
