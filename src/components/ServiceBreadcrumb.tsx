
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ServiceBreadcrumbProps {
  currentPage?: string;
  currentPath?: string;
  items?: BreadcrumbItem[];
}

const ServiceBreadcrumb: React.FC<ServiceBreadcrumbProps> = ({ currentPage, currentPath, items }) => {
  // If items array is provided, use it; otherwise, use the legacy props
  const breadcrumbItems = items || [
    { label: 'Strona główna', href: '/' },
    { label: 'Usługi', href: '#services' },
    { label: currentPage || '', href: currentPath || '' }
  ];

  return (
    <div className="container mx-auto px-4 pt-28 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
              
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : index === 1 ? (
                  <span className="text-muted-foreground cursor-default">{item.label}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ServiceBreadcrumb;
