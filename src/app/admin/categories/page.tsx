"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
      setLoading(false);
    })();
  }, [user]);

  const add = async (e: any) => {
    e.preventDefault();
    if (!user) return alert("Login as admin");
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return alert("Create failed");
    const data = await res.json();
    const entry = { id: data.id, ...(data.data || {}) };
    setItems((s) => [entry, ...s]);
    setName("");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete category?")) return;
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setItems((s) => s.filter((i) => i.id !== id));
    else alert("Delete failed");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <form onSubmit={add} className="mb-4">
        <input
          className="input mr-2"
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Create
        </button>
      </form>

      {loading && <p>Loading…</p>}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between p-3 bg-white rounded shadow"
          >
            <span>{c.name}</span>
            <div>
              <button onClick={() => remove(c.id)} className="text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
