import Database from "better-sqlite3";
import { PRODUCTS } from "./products";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDesc: string;
  priceCents: number;
  isActive: number;
  popularity: number;
  digitalFileId?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  image?: string;
}

// Create database connection for serverless environment
let db: Database.Database | null = null;

function initDb(database: Database.Database) {
  database
    .prepare(`
      CREATE TABLE IF NOT EXISTS Category (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `)
    .run();

  database
    .prepare(`
      CREATE TABLE IF NOT EXISTS Product (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        longDesc TEXT,
        priceCents INTEGER NOT NULL,
        isActive INTEGER NOT NULL,
        popularity INTEGER NOT NULL,
        categoryId TEXT,
        image TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    .run();

  database
    .prepare(`
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    .run();

  database
    .prepare(`
      CREATE TABLE IF NOT EXISTS Session (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        token TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id)
      )
    `)
    .run();
}

function getDatabaseConnection() {
  if (db) return db;
  
  try {
    // Skip database during build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null;
    }
    
    // In Vercel serverless, use /tmp for writable storage
    const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/dev.db' : './dev.db';
    
    // Ensure directory exists
    const dbDir = dirname(dbPath);
    mkdirSync(dbDir, { recursive: true });
    
    const database = new Database(dbPath);
    initDb(database);
    db = database;
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    return null;
  }
}

// Seed helper
export function seedDb() {
  const db = getDatabaseConnection();
  if (!db) return { categories: 0, products: 0 };
  
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  const categoryMap = new Map<string, string>();

  const insertCategory = db.prepare("INSERT OR IGNORE INTO Category (id, name) VALUES (?, ?)");
  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO Product (
      id, slug, title, description, longDesc, priceCents, isActive, popularity, categoryId, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const name of categories) {
    const id = `cat_${name.toLowerCase().replace(/\s+/g, "_")}`;
    insertCategory.run(id, name);
    categoryMap.set(name, id);
  }

  for (const p of PRODUCTS) {
    insertProduct.run(
      `prod_${p.slug}`,
      p.slug,
      p.title,
      p.description,
      p.longDescription,
      p.priceCents,
      1,
      p.popularityScore,
      categoryMap.get(p.category),
      p.image || null
    );
  }

  return { categories: categories.length, products: PRODUCTS.length };
}

// Query helpers
export function getProducts() {
  const db = getDatabaseConnection();
  if (!db) return [];
  const rows = db.prepare(`
    SELECT
      p.*,
      c.name as categoryName
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
    WHERE p.isActive = 1
    ORDER BY p.popularity DESC, p.createdAt DESC
  `).all() as (Product & { categoryName: string | null })[];
  return rows.map((p) => ({
    ...p,
    categoryName: p.categoryName ?? undefined,
  }));
}

// Query helpers with auto-seeding
export function getProductsWithSeeding() {
  const db = getDatabaseConnection();
  if (!db) return [];
  
  let products = getProducts();
  
  // If no products, seed the database
  if (products.length === 0) {
    console.log("No products found, seeding database in getProductsWithSeeding");
    const result = seedDb();
    console.log('Seeded database:', result);
    products = getProducts();
    console.log('Products after seeding:', products.length);
  }
  
  return products;
}

export function getProductBySlug(slug: string) {
  const db = getDatabaseConnection();
  if (!db) return undefined;
  const row = db.prepare(`
    SELECT
      p.*,
      c.name as categoryName
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
    WHERE p.slug = ? AND p.isActive = 1
  `).get(slug) as (Product & { categoryName: string | null }) | undefined;
  if (!row) return undefined;
  return {
    ...row,
    categoryName: row.categoryName ?? undefined,
  };
}

// Order helpers
export function createOrder(userId: string, items: { productId: string; quantity: number; unitCents: number }[]) {
  const db = getDatabaseConnection();
  if (!db) return { orderId: "", totalCents: 0 };
  
  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const subtotalCents = items.reduce((sum, i) => sum + i.unitCents * i.quantity, 0);
  const totalCents = subtotalCents; // No tax/discount for now

  const insertOrder = db.prepare(`
    INSERT INTO "Order" (id, userId, subtotalCents, totalCents)
    VALUES (?, ?, ?, ?)
  `);
  insertOrder.run(orderId, userId, subtotalCents, totalCents);

  const insertItem = db.prepare(`
    INSERT INTO OrderItem (id, orderId, productId, quantity, unitCents, totalCents)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const item of items) {
    const itemId = `item_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const itemTotal = item.unitCents * item.quantity;
    insertItem.run(itemId, orderId, item.productId, item.quantity, item.unitCents, itemTotal);
  }

  return { orderId, totalCents };
}

export function getUserOrders(userId: string) {
  const db = getDatabaseConnection();
  if (!db) return [];
  
  const orders = db.prepare(`
    SELECT
      o.*,
      COUNT(oi.id) as itemCount
    FROM "Order" o
    LEFT JOIN OrderItem oi ON o.id = oi.orderId
    WHERE o.userId = ?
    GROUP BY o.id
    ORDER BY o.createdAt DESC
  `).all(userId) as any[];

  // Get items for each order
  for (const order of orders) {
    order.items = db.prepare(`
      SELECT
        oi.*,
        p.title as productTitle,
        p.slug as productSlug
      FROM OrderItem oi
      LEFT JOIN Product p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `).all(order.id) as any[];
    
    // Map product title to the expected format
    order.items = order.items.map((item: any) => ({
      ...item,
      product: {
        title: item.productTitle,
        slug: item.productSlug
      }
    }));
  }

  return orders;
}

// Auth helpers
export function createUser(name: string, email: string, passwordHash: string) {
  const db = getDatabaseConnection();
  if (!db) return { userId: "" };
  
  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const insert = db.prepare(`
    INSERT INTO User (id, name, email, passwordHash)
    VALUES (?, ?, ?, ?)
  `);
  insert.run(userId, name, email, passwordHash);
  return { userId };
}

export function getUserByEmail(email: string) {
  const db = getDatabaseConnection();
  if (!db) return undefined;
  return db.prepare("SELECT * FROM User WHERE email = ?").get(email) as any | undefined;
}

export function createSession(userId: string, tokenHash: string, expiresAt: Date) {
  const db = getDatabaseConnection();
  if (!db) return { sessionId: "" };
  
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const insert = db.prepare(`
    INSERT INTO Session (id, userId, tokenHash, expiresAt)
    VALUES (?, ?, ?, ?)
  `);
  insert.run(sessionId, userId, tokenHash, expiresAt.toISOString());
  return { sessionId };
}

export function getSessionByTokenHash(tokenHash: string) {
  const db = getDatabaseConnection();
  if (!db) return undefined;
  return db.prepare(`
    SELECT s.*, u.* FROM Session s
    JOIN User u ON s.userId = u.id
    WHERE s.tokenHash = ? AND s.expiresAt > datetime('now')
  `).get(tokenHash) as any | undefined;
}

export function deleteSessionByTokenHash(tokenHash: string) {
  const db = getDatabaseConnection();
  if (!db) return;
  return db.prepare("DELETE FROM Session WHERE tokenHash = ?").run(tokenHash);
}

// Review helpers
export function createReview(productId: string, userId: string, rating: number, title: string | null, content: string) {
  const db = getDatabaseConnection();
  if (!db) return { reviewId: "" };
  
  const reviewId = `review_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const insert = db.prepare(`
    INSERT INTO Review (id, productId, userId, rating, title, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insert.run(reviewId, productId, userId, rating, title, content);
  return { reviewId };
}

export function getProductReviews(productId: string) {
  const db = getDatabaseConnection();
  if (!db) return [];
  return db.prepare(`
    SELECT
      r.*,
      u.name as userName,
      u.email as userEmail
    FROM Review r
    LEFT JOIN User u ON r.userId = u.id
    WHERE r.productId = ?
    ORDER BY r.createdAt DESC
  `).all(productId) as any[];
}

export function getProductReviewSummary(productId: string) {
  const db = getDatabaseConnection();
  if (!db) return {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
  };
  
  const summary = db.prepare(`
    SELECT
      COUNT(*) as totalReviews,
      AVG(rating) as averageRating,
      COUNT(CASE WHEN rating = 5 THEN 1 END) as fiveStar,
      COUNT(CASE WHEN rating = 4 THEN 1 END) as fourStar,
      COUNT(CASE WHEN rating = 3 THEN 1 END) as threeStar,
      COUNT(CASE WHEN rating = 2 THEN 1 END) as twoStar,
      COUNT(CASE WHEN rating = 1 THEN 1 END) as oneStar
    FROM Review
    WHERE productId = ?
  `).get(productId) as any;
  
  return {
    totalReviews: summary.totalReviews || 0,
    averageRating: summary.averageRating ? Math.round(summary.averageRating * 10) / 10 : 0,
    ratingDistribution: {
      5: summary.fiveStar || 0,
      4: summary.fourStar || 0,
      3: summary.threeStar || 0,
      2: summary.twoStar || 0,
      1: summary.oneStar || 0,
    }
  };
}

export function updateReview(reviewId: string, rating: number, title: string | null, content: string, userId: string) {
  const db = getDatabaseConnection();
  if (!db) return { updated: false };
  
  const update = db.prepare(`
    UPDATE Review 
    SET rating = ?, title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ? AND userId = ?
  `);
  const result = update.run(rating, title, content, reviewId, userId);
  return { updated: result.changes > 0 };
}

export function deleteReview(reviewId: string, userId: string) {
  const db = getDatabaseConnection();
  if (!db) return { deleted: false };
  
  const deleteStmt = db.prepare("DELETE FROM Review WHERE id = ? AND userId = ?");
  const result = deleteStmt.run(reviewId, userId);
  return { deleted: result.changes > 0 };
}

export function getUserReviewForProduct(productId: string, userId: string) {
  const db = getDatabaseConnection();
  if (!db) return undefined;
  return db.prepare(`
    SELECT * FROM Review 
    WHERE productId = ? AND userId = ?
  `).get(productId, userId) as any | undefined;
}

export default db;
