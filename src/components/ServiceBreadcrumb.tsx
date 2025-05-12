
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ServiceBreadcrumbProps {
  items: BreadcrumbItem[];
}

const ServiceBreadcrumb: React.FC<ServiceBreadcrumbProps> = ({ items }) => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <span className="text-muted-foreground cursor-default">{item.label}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {index < items.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ServiceBreadcrumb;
