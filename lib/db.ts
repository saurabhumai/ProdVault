import Database from "better-sqlite3";
import { PRODUCTS } from "./products";

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

// Only create database connection if not in build time
const db = process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build' ? null : new Database("./dev.db");

// Initialize tables
if (db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Category (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS Product (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      longDesc TEXT NOT NULL,
      priceCents INTEGER NOT NULL,
      isActive INTEGER DEFAULT 1,
      popularity INTEGER DEFAULT 0,
      digitalFileId TEXT,
      categoryId TEXT,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES Category(id)
    );
    CREATE TABLE IF NOT EXISTS Review (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      userId TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT,
      content TEXT NOT NULL,
      isVerified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      isBlocked INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS Session (
      id TEXT PRIMARY KEY,
      tokenHash TEXT UNIQUE NOT NULL,
      userId TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    );
    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY,
      status TEXT DEFAULT "PENDING",
      currency TEXT DEFAULT "INR",
      subtotalCents INTEGER NOT NULL,
      discountCents INTEGER DEFAULT 0,
      taxCents INTEGER DEFAULT 0,
      totalCents INTEGER NOT NULL,
      userId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    );
    CREATE TABLE IF NOT EXISTS OrderItem (
      id TEXT PRIMARY KEY,
      quantity INTEGER DEFAULT 1,
      unitCents INTEGER NOT NULL,
      totalCents INTEGER NOT NULL,
      orderId TEXT NOT NULL,
      productId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES "Order"(id),
      FOREIGN KEY (productId) REFERENCES Product(id)
    );
    CREATE TABLE IF NOT EXISTS Payment (
      id TEXT PRIMARY KEY,
      status TEXT DEFAULT "PENDING",
      provider TEXT NOT NULL,
      providerRef TEXT,
      amountCents INTEGER NOT NULL,
      currency TEXT DEFAULT "INR",
      rawPayload TEXT,
      orderId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES "Order"(id)
    );
    CREATE TABLE IF NOT EXISTS Download (
      id TEXT PRIMARY KEY,
      status TEXT DEFAULT "ISSUED",
      tokenHash TEXT UNIQUE NOT NULL,
      expiresAt DATETIME NOT NULL,
      usedAt DATETIME,
      userId TEXT NOT NULL,
      productId TEXT NOT NULL,
      orderId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id),
      FOREIGN KEY (productId) REFERENCES Product(id),
      FOREIGN KEY (orderId) REFERENCES "Order"(id)
    );
  `);
}

// Seed helper
export function seedDb() {
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

export function getProductBySlug(slug: string) {
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
  if (!db) return undefined;
  return db.prepare("SELECT * FROM User WHERE email = ?").get(email) as any | undefined;
}

export function createSession(userId: string, tokenHash: string, expiresAt: Date) {
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
  if (!db) return undefined;
  return db.prepare(`
    SELECT s.*, u.* FROM Session s
    JOIN User u ON s.userId = u.id
    WHERE s.tokenHash = ? AND s.expiresAt > datetime('now')
  `).get(tokenHash) as any | undefined;
}

export function deleteSessionByTokenHash(tokenHash: string) {
  if (!db) return;
  return db.prepare("DELETE FROM Session WHERE tokenHash = ?").run(tokenHash);
}

// Review helpers
export function createReview(productId: string, userId: string, rating: number, title: string | null, content: string) {
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
  if (!db) return { deleted: false };
  
  const deleteStmt = db.prepare("DELETE FROM Review WHERE id = ? AND userId = ?");
  const result = deleteStmt.run(reviewId, userId);
  return { deleted: result.changes > 0 };
}

export function getUserReviewForProduct(productId: string, userId: string) {
  if (!db) return undefined;
  return db.prepare(`
    SELECT * FROM Review 
    WHERE productId = ? AND userId = ?
  `).get(productId, userId) as any | undefined;
}

export default db;
