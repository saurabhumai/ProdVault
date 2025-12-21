export async function GET() {
  return Response.json({ orders: [] });
}

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
