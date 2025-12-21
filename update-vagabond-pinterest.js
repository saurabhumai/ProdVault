const Database = require('better-sqlite3');

const db = new Database('./dev.db');

console.log("Updating Vagabond with Pinterest image...");

// Update Vagabond product with Pinterest image
const updateProduct = db.prepare("UPDATE Product SET image = ? WHERE id = ?");

const productId = "prod_vagabond-volume-1";
const newImageUrl = "https://i.pinimg.com/736x/ef/7a/31/ef7a31f122a13d89f61bae525d87eddc.jpg";

const result = updateProduct.run(newImageUrl, productId);
if (result.changes > 0) {
  console.log(`Successfully updated Vagabond with Pinterest image.`);
} else {
  console.log(`No product found with ID: ${productId}`);
}

db.close();
