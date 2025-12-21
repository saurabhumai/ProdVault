const Database = require('better-sqlite3');
const db = new Database('./dev.db');
const products = db.prepare('SELECT slug, title, image FROM Product ORDER BY title').all();

console.log('Current images in database:');
products.forEach(p => {
  console.log(`${p.title} (${p.slug}): ${p.image || 'NO IMAGE'}`);
});

db.close();
