"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

type Gem = {
  id: string;
  title: string;
  imageUrl?: string | null;
  type: string;
  weightCarats: string;
  color: string;
  clarity: string;
  origin: string;
  price: string;
  certification?: string | null;
};

export default function MarketplacePage() {
  const [gems, setGems] = useState<Gem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const items = await apiRequest<Gem[]>("/gems");
        setGems(items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load marketplace");
      }
    }

    void load();
  }, []);

  return (
    <main>
      <section className="card" style={{ marginBottom: 16 }}>
        <h1>Discover Verified Gemstones</h1>
        <p>Only admin-approved listings appear here.</p>
      </section>

      {error ? <p>{error}</p> : null}

      <section className="grid grid-3">
        {gems.map((gem) => (
          <article key={gem.id} className="card">
            {gem.imageUrl ? <img src={gem.imageUrl} alt={gem.title} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12, marginBottom: 10 }} /> : null}
            <h3>{gem.title}</h3>
            <p>{gem.type}</p>
            <p>{gem.weightCarats} ct</p>
            <p>{gem.color} / {gem.clarity}</p>
            <p>{gem.origin}</p>
            <p>{gem.certification ? `Cert: ${gem.certification}` : "No certification"}</p>
            <p>
              <strong>${Number(gem.price).toLocaleString()}</strong>
            </p>
          </article>
        ))}
      </section>
      {!error && gems.length === 0 ? <p>No approved gems yet.</p> : null}
    </main>
  );
}
