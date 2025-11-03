import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { readStore } from "@/lib/localStore";

export async function GET(req: Request) {
  if (!(await assertAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const orders = readStore<any[]>("orders", []);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s: number, o: any) => s + (o.grandTotal || o.total || 0), 0);

    const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach((order: any) => {
      const items = order.items || [];
      items.forEach((it: any) => {
        const id = it.id || it.productId || it._id || it.slug || JSON.stringify(it);
        if (!productMap[id]) productMap[id] = { name: it.name || it.title || "", qty: 0, revenue: 0 };
        productMap[id].qty += it.quantity || 1;
        productMap[id].revenue += (it.price || 0) * (it.quantity || 1);
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([id, v]) => ({ id, name: v.name, qty: v.qty, revenue: v.revenue }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    return NextResponse.json({ totalOrders, totalRevenue, topProducts });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
