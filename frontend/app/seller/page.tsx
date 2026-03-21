"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

type Gem = {
  id: string;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
  price: string;
  imageUrl?: string | null;
};

const initialForm = {
  title: "",
  description: "",
  imageUrl: "",
  type: "",
  weightCarats: "",
  color: "",
  clarity: "",
  origin: "",
  certification: "",
  price: "",
};

export default function SellerDashboardPage() {
  const [form, setForm] = useState(initialForm);
  const [gems, setGems] = useState<Gem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadMine() {
    try {
      const data = await apiRequest<Gem[]>("/gems/mine", { auth: true });
      setGems(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load listings");
    }
  }

  useEffect(() => {
    void loadMine();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiRequest("/gems", {
        method: "POST",
        auth: true,
        body: {
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl || undefined,
          type: form.type,
          weightCarats: Number(form.weightCarats),
          color: form.color,
          clarity: form.clarity,
          origin: form.origin,
          certification: form.certification || undefined,
          price: Number(form.price),
        },
      });
      setForm(initialForm);
      setMessage("Gem submitted. Waiting for admin approval.");
      await loadMine();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to submit gem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid" style={{ gap: 16 }}>
      <h1>Seller Dashboard</h1>

      <section className="card">
        <h3>Create Listing</h3>
        <form onSubmit={onSubmit} className="grid grid-3" style={{ gap: 12 }}>
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          <input className="input" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <input className="input" placeholder="Weight (carats)" type="number" step="0.01" value={form.weightCarats} onChange={(e) => setForm({ ...form, weightCarats: e.target.value })} required />
          <input className="input" placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required />
          <input className="input" placeholder="Clarity" value={form.clarity} onChange={(e) => setForm({ ...form, clarity: e.target.value })} required />
          <input className="input" placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} required />
          <input className="input" placeholder="Certification (optional)" value={form.certification} onChange={(e) => setForm({ ...form, certification: e.target.value })} />
          <input className="input" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
          <button className="btn" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Gem"}</button>
        </form>
        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
      </section>

      <section className="card">
        <h3>My Listings</h3>
        <div className="grid" style={{ gap: 8 }}>
          {gems.map((gem) => (
            <div key={gem.id} className="card">
              {gem.imageUrl ? <img src={gem.imageUrl} alt={gem.title} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12, marginBottom: 8 }} /> : null}
              <strong>{gem.title}</strong>
              <p>Status: {gem.status}</p>
              <p>Price: ${Number(gem.price).toLocaleString()}</p>
            </div>
          ))}
          {gems.length === 0 ? <p>No listings yet.</p> : null}
        </div>
      </section>
    </main>
  );
}
