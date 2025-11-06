import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { readStore, writeStore, generateId } from "@/lib/localStore";

export async function GET(req: Request) {
  if (!(await assertAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const items = readStore<any[]>("products", []);
    // newest first
    const sorted = items.sort(
      (a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    return NextResponse.json({ items: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await assertAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const items = readStore<any[]>("products", []);
    const id = generateId("prod");
    const entry = { id, ...body, createdAt: Date.now() };
    items.unshift(entry);
    writeStore("products", items);
    return NextResponse.json({ id, data: entry });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
