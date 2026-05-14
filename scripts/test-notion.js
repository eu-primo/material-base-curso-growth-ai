require('dotenv').config();
const { Client } = require('@notionhq/client');

async function main() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  // Listar paginas e databases acessiveis
  const results = await notion.search({});
  const databases = results.results.filter(r => r.object === 'database');
  const pages = results.results.filter(r => r.object === 'page');

  console.log('Databases acessiveis:', databases.length);
  databases.forEach(db => {
    const title = db.title.map(t => t.plain_text).join('') || '(sem titulo)';
    console.log('  -', title);
    console.log('   ', db.url);
  });

  console.log();
  console.log('Paginas acessiveis:', pages.length);
  pages.slice(0, 5).forEach(page => {
    let title = '(sem titulo)';
    if (page.properties) {
      for (const val of Object.values(page.properties)) {
        if (val.type === 'title' && val.title && val.title.length > 0) {
          title = val.title.map(t => t.plain_text).join('');
          break;
        }
      }
    }
    console.log('  -', title);
  });

  if (pages.length > 5) {
    console.log('  ... e mais', pages.length - 5, 'paginas');
  }

  console.log('\nConexao com Notion OK!');
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
