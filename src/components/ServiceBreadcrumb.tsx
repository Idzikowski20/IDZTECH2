
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItemProps {
  label: string;
  href: string | null;
}

interface ServiceBreadcrumbProps {
  items: BreadcrumbItemProps[];
}

const ServiceBreadcrumb: React.FC<ServiceBreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList className="text-premium-light/60">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <span className="cursor-default">{item.label}</span>
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
  );
};

export default ServiceBreadcrumb;
