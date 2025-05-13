
import React, { Suspense, lazy } from 'react';

// Lazy load the SanityStudioLoader to avoid SSR issues
const SanityStudioLoader = lazy(() => import('../components/SanityStudioLoader'));

const AdminStudio = () => {
  return (
    <div className="h-screen">
      <div id="sanity-studio" className="w-full h-full">
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Loading Sanity Studio...</p>
        </div>
      </div>
      <Suspense fallback={null}>
        <SanityStudioLoader />
      </Suspense>
    </div>
  );
};

export default AdminStudio;
