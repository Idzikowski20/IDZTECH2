
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface SubItem {
  path: string;
  label: string;
}

interface CategoryGroup {
  title: string;
  items: SubItem[];
}

interface MobileAccordionItemProps {
  value: string;
  title: string;
  categories: CategoryGroup[];
  onClick: () => void;
}

const MobileAccordionItem: React.FC<MobileAccordionItemProps> = ({ 
  value, 
  title, 
  categories, 
  onClick 
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  
  const isActive = (path: string) => location.pathname === path;
  
  // Check if any item in the accordion is active
  const isAnyChildActive = categories.some(category => 
    category.items.some(item => isActive(item.path))
  );
  
  return (
    <AccordionItem value={value} className={theme === 'light' ? 'border-gray-200' : 'border-white/10'}>
      <AccordionTrigger 
        className={`${textColor} text-lg px-3 py-2 ${
          theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-gray-800 hover:text-white'
        } rounded-lg ${
          isAnyChildActive ? 'font-bold border-b-2 border-premium-blue' : ''
        }`}
      >
        {title}
      </AccordionTrigger>
      <AccordionContent className="max-h-[250px] overflow-hidden">
        <div className="space-y-2 pl-2">
          {categories.map((category, idx) => (
            <React.Fragment key={idx}>
              <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 ${idx > 0 ? 'mt-4' : 'mt-2'}`}>
                {category.title}
              </h3>
              {category.items.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${
                    isActive(item.path) ? 'font-bold border-b border-premium-blue' : ''
                  } ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-gray-800 hover:text-white'}`}
                  onClick={onClick}
                >
                  {item.label}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MobileAccordionItem;
