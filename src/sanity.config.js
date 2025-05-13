
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { seoTool } from 'sanity-plugin-seo-tools';
import { dashboardTool } from '@sanity/dashboard';
import { netlifyWidget } from 'sanity-plugin-dashboard-widget-netlify';
import { contentCalendar } from 'sanity-plugin-content-calendar';
import { iconPicker } from 'sanity-plugin-icon-picker';

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
    media(),
    seoTool({
      name: 'seo',
      title: 'SEO',
      baseUrl: 'https://idztech.pl', 
      defaultSeo: {
        title: 'idztech.pl',
        description: 'Strona technologiczna od wariatów dla wariatów',
      },
    }),
    dashboardTool({
      widgets: [
        netlifyWidget({
          title: 'Deploy na Netlify',
          sites: [
            {
              title: 'idztech.pl',
              apiId: process.env.NETLIFY_API_ID || 'TWÓJ_NETLIFY_API_ID',
              buildHookId: process.env.NETLIFY_BUILD_HOOK_ID || 'TWÓJ_BUILD_HOOK',
              name: 'idztech',
            },
          ],
        }),
      ],
    }),
    contentCalendar(),
    iconPicker(),
  ],

  schema: {
    types: schema,
  },
});
