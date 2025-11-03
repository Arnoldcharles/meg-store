import { NextResponse } from "next/server";
import { readStore, writeStore, generateId } from "@/lib/localStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orders = readStore<any[]>("orders", []);
    const id = body.id || generateId("ord");
    const entry = { id, ...body, createdAt: Date.now() };
    orders.unshift(entry);
    writeStore("orders", orders);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
