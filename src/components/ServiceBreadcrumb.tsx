
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface ServiceBreadcrumbProps {
  currentPage: string;
  currentPath: string;
}

const ServiceBreadcrumb: React.FC<ServiceBreadcrumbProps> = ({ currentPage, currentPath }) => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Strona główna</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          
          <BreadcrumbItem>
            <span className="text-muted-foreground cursor-default">Usługi</span>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={currentPath}>
                {currentPage}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ServiceBreadcrumb;
