const Database = require('better-sqlite3');

const db = new Database('./dev.db');

console.log("Replacing Overlord with Lookism...");

// First, delete the Overlord product
const deleteProduct = db.prepare("DELETE FROM Product WHERE id = ?");
const deleteResult = deleteProduct.run("prod_overlord-volume-1");

if (deleteResult.changes > 0) {
  console.log(`Successfully deleted Overlord product.`);
} else {
  console.log(`No Overlord product found to delete.`);
}

// Then, insert the new Lookism product
const insertProduct = db.prepare(`
  INSERT INTO Product (id, slug, title, description, longDescription, priceCents, category, badge, highlights, popularityScore, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const lookismData = {
  id: "prod_lookism-volume-1",
  slug: "lookism-volume-1",
  title: "Lookism Volume 1",
  description: "A weak high school student wakes up in a handsome new body.",
  longDescription: "Daniel Park is an overweight high school student who gets bullied. One day, he wakes up in a new, handsome, and strong body while his original body continues to exist. A story of self-discovery and dual lives.",
  priceCents: 89900,
  category: "Web Novel",
  badge: null,
  highlights: JSON.stringify(["Body swap concept", "School life drama", "Action and comedy", "Korean webtoon phenomenon"]),
  popularityScore: 89,
  image: "https://images-cdn.ubuy.com.mm/65bf6b9a3ba34526460a001f-lookism-vol-20-korean-comics-line-naver.jpg"
};

const insertResult = insertProduct.run(
  lookismData.id,
  lookismData.slug,
  lookismData.title,
  lookismData.description,
  lookismData.longDescription,
  lookismData.priceCents,
  lookismData.category,
  lookismData.badge,
  lookismData.highlights,
  lookismData.popularityScore,
  lookismData.image
);

if (insertResult.changes > 0) {
  console.log(`Successfully added Lookism product.`);
} else {
  console.log(`Failed to add Lookism product.`);
}

console.log(`Product replacement complete!`);
db.close();
