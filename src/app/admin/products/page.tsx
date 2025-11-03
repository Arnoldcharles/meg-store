"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminProductsList() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItems(data.items || []);
      } catch (e: any) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const remove = async (id: string) => {
    if (!confirm("Delete product?")) return;
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setItems((s) => s.filter((i) => i.id !== id));
    else alert("Delete failed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link href="/admin/products/new" className="btn-primary">Add product</Link>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{p.name || p.title || p.slug}</h3>
            <p className="text-sm text-gray-600">₦{p.price}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/admin/products/${p.id}`} className="text-blue-600">Edit</Link>
              <button onClick={() => remove(p.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
