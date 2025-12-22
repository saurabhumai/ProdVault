import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ 
    message: "Download endpoint temporarily disabled for deployment",
    status: "offline"
  });
}

export async function GET() {
  return NextResponse.json({ 
    message: "Download endpoint temporarily disabled for deployment",
    status: "offline"
  });
}
