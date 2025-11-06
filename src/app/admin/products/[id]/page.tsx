"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditProductPage() {
  const { user } = useAuth();
  const params = useParams() as any;
  const id = params.id as string;
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return alert("Failed to load");
      const data = await res.json();
      setForm({ ...(data.data || {}), id: data.id });
      setLoading(false);
    })();
  }, [user, id]);

  const save = async (e: any) => {
    e.preventDefault();
    if (!user) return alert("Login as admin");
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (!res.ok) return alert("Save failed");
    router.push("/admin/products");
  };

  if (loading || !form) return <p>Loading…</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit product</h2>
      <form onSubmit={save} className="space-y-3 max-w-md">
        <input
          className="input"
          placeholder="Name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Slug"
          value={form.slug || ""}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          type="number"
          className="input"
          placeholder="Price"
          value={form.price || 0}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2">
          <button className="btn-primary" type="submit">
            Save
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
