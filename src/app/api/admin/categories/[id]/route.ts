import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { readStore, writeStore } from "@/lib/localStore";

export async function GET(req: Request, { params }: any) {
  if (!(await assertAdmin(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = params;
  try {
    const items = readStore<any[]>("categories", []);
    const doc = items.find((c) => c.id === id);
    if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ id: doc.id, data: doc });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: any) {
  if (!(await assertAdmin(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  try {
    const body = await req.json();
    const items = readStore<any[]>("categories", []);
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "not_found" }, { status: 404 });
    items[idx] = { ...items[idx], ...body };
    writeStore("categories", items);
    return NextResponse.json({ id, data: items[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  if (!(await assertAdmin(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  try {
    const items = readStore<any[]>("categories", []);
    const newItems = items.filter((c) => c.id !== id);
    writeStore("categories", newItems);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
