const Database = require('better-sqlite3');
const db = new Database('./dev.db');
const products = db.prepare('SELECT DISTINCT image FROM Product WHERE image IS NOT NULL').all();

console.log('Image domains in database:');
const domains = new Set();
products.forEach(p => {
  if (p.image) {
    try {
      const url = new URL(p.image);
      domains.add(url.hostname);
    } catch (e) {
      console.log('Invalid URL:', p.image);
    }
  }
});

domains.forEach(domain => console.log(domain));

db.close();
