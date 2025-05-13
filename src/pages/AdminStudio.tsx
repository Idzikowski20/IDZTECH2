
import React from 'react';
import { Studio } from 'sanity';
import config from '../sanity.config';

const AdminStudio = () => {
  return (
    <div className="h-screen">
      <Studio config={config} />
    </div>
  );
};

export default AdminStudio;
