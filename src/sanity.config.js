
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import schema from './schemas/sanity/schema';

export default defineConfig({
  name: 'default',
  title: 'IDZ.Tech CMS',

  projectId: 'ahdhzkts',
  dataset: 'production',
  
  basePath: '/admin/studio',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: schema,
  },
});
