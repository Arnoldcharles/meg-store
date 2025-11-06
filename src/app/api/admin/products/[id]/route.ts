import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { readStore, writeStore } from "@/lib/localStore";

export async function GET(req: Request, { params }: any) {
  if (!(await assertAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = params;
  try {
    const items = readStore<any[]>("products", []);
    const doc = items.find((p) => p.id === id);
    if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ id: doc.id, data: doc });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: any) {
  if (!(await assertAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  try {
    const body = await req.json();
    const items = readStore<any[]>("products", []);
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1)
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    items[idx] = { ...items[idx], ...body };
    writeStore("products", items);
    return NextResponse.json({ id, data: items[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  if (!(await assertAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  try {
    const items = readStore<any[]>("products", []);
    const newItems = items.filter((p) => p.id !== id);
    writeStore("products", newItems);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
