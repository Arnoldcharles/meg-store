"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NewProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<any>({
    name: "",
    price: 0,
    description: "",
    slug: "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!user) return alert("Login as admin");
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/admin/products/${data.id}`);
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create product</h2>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          type="number"
          className="input"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
