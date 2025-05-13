
import React from 'react';
import { NextStudio } from 'next-sanity/studio';
import config from '../sanity.config';

const AdminStudio = () => {
  return <NextStudio config={config} />;
};

export default AdminStudio;
