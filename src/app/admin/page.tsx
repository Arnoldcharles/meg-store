"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setStats(data);
      } catch (e: any) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin dashboard</h1>
      {loading && <p>Loading stats…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm text-gray-500">Total orders</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm text-gray-500">Total revenue</h3>
            <p className="text-2xl font-bold">₦{stats.totalRevenue}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm text-gray-500">Top products</h3>
            <ol className="list-decimal pl-5">
              {stats.topProducts.map((p: any) => (
                <li key={p.id} className="py-1">
                  {p.name || p.id} — {p.qty} sold
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
