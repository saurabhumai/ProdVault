import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Database from "better-sqlite3";

interface DownloadRow {
  id: string;
  status: string;
  expiresAt: string;
  usedAt?: string;
  productId: string;
  slug: string;
  title: string;
}

export async function GET(request: NextRequest) {
  // Return mock response during build to enable deployment
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      ok: true,
      message: "Download endpoint - Under development",
      product: {
        id: "mock-product-id",
        slug: "mock-product",
        title: "Mock Product",
      },
    });
  }

  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const db = new Database("./dev.db");
  
  const row = db.prepare(`
    SELECT 
      d.id,
      d.status,
      d.expiresAt,
      d.usedAt,
      p.id as productId,
      p.slug,
      p.title
    FROM Download d
    LEFT JOIN Product p ON d.productId = p.id
    WHERE d.tokenHash = ?
  `).get(tokenHash) as DownloadRow | undefined;

  db.close();

  if (!row) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (row.status !== "ISSUED") {
    return NextResponse.json({ error: "NOT_ACTIVE" }, { status: 410 });
  }

  if (new Date(row.expiresAt) <= new Date()) {
    return NextResponse.json({ error: "EXPIRED" }, { status: 410 });
  }

  return NextResponse.json({
    ok: true,
    message: "File delivery will be implemented next (S3/local storage streaming).",
    product: {
      id: row.productId,
      slug: row.slug,
      title: row.title,
    },
  });
}
