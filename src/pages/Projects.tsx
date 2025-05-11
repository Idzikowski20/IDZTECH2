
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const projectsData = [
  {
    title: 'Projekt 1',
    description: 'Krótki opis projektu 1.',
    image: 'url_do_obrazka_1',
    link: '/projekt-1',
  },
  {
    title: 'Projekt 2',
    description: 'Krótki opis projektu 2.',
    image: 'url_do_obrazka_2',
    link: '/projekt-2',
  },
  {
    title: 'Projekt 3',
    description: 'Krótki opis projektu 3.',
    image: 'url_do_obrazka_3',
    link: '/projekt-3',
  },
];

const ProjectItem = ({ item }: { item: (typeof projectsData)[0] }) => (
  <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-64 object-cover transform scale-100 group-hover:scale-110 transition-transform duration-300"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-center items-center">
      <h3 className="text-xl font-semibold text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.title}</h3>
      <p className="text-sm text-gray-300 text-center px-6 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p>
      <a 
        href={item.link} 
        className="inline-flex items-center text-white hover:text-premium-blue transition-colors opacity-0 group-hover:opacity-100"
      >
        Zobacz szczegóły
        <ExternalLink size={16} className="ml-2" />
      </a>
    </div>
  </div>
);

const Projects = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === 'light' ? "bg-white text-black" : "bg-premium-dark text-white"}>
      <div className="container mx-auto py-24 px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Nasze Projekty</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((item, index) => (
            <ProjectItem key={index} item={item} />
          ))}
        </div>
        <div className="text-center mt-16">
          <p className="text-lg mb-8">Chcesz dowiedzieć się więcej o naszym zespole i podejściu?</p>
          <Link to="/about">
            <Button 
              variant="outline" 
              className={`
                ${theme === 'light' 
                  ? 'border-premium-purple/50 text-black hover:text-white hover:bg-premium-purple/80' 
                  : 'border-premium-purple/50 text-white hover:text-black hover:bg-premium-purple/10'
                } 
                rounded-full px-8 py-6
              `}
            >
              Poznaj nasz zespół
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
