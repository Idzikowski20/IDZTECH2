const { generateSitemapDuringBuild } = require('../src/utils/generateSitemap');

// Generuj sitemap podczas builda
generateSitemapDuringBuild()
  .then(() => {
    console.log('Sitemap.xml został wygenerowany pomyślnie');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Błąd podczas generowania sitemap.xml:', error);
    process.exit(1);
  }); 