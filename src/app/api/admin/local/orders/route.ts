import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { readStore } from "@/lib/localStore";

export async function GET(req: Request) {
  if (!(await assertAdmin(req)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const orders = readStore<any[]>("orders", []);
    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
