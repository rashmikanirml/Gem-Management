"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

type PendingGem = {
  id: string;
  title: string;
  type: string;
  price: string;
  seller: {
    name: string;
    email: string;
  };
};

export default function AdminPage() {
  const [gems, setGems] = useState<PendingGem[]>([]);
  const [message, setMessage] = useState("");

  async function loadPending() {
    try {
      setMessage("");
      const data = await apiRequest<PendingGem[]>("/admin/gems/pending", { auth: true });
      setGems(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load pending gems");
    }
  }

  async function moderate(id: string, action: "approve" | "reject") {
    try {
      await apiRequest(`/admin/gems/${id}/${action}`, { method: "PUT", auth: true });
      setMessage(`Gem ${action}d successfully.`);
      await loadPending();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Moderation failed");
    }
  }

  useEffect(() => {
    void loadPending();
  }, []);

  return (
    <main className="grid" style={{ gap: 16 }}>
      <h1>Admin Moderation</h1>
      <section className="card">
        <h3>Pending Listings</h3>
        {message ? <p>{message}</p> : null}
        <div className="grid" style={{ gap: 8 }}>
          {gems.map((gem) => (
            <article key={gem.id} className="card">
              <h4>{gem.title}</h4>
              <p>{gem.type}</p>
              <p>Seller: {gem.seller.name} ({gem.seller.email})</p>
              <p>Price: ${Number(gem.price).toLocaleString()}</p>
              <div className="links">
                <button className="btn" onClick={() => moderate(gem.id, "approve")}>Approve</button>
                <button className="btn" onClick={() => moderate(gem.id, "reject")}>Reject</button>
              </div>
            </article>
          ))}
          {gems.length === 0 ? <p>No pending listings.</p> : null}
        </div>
      </section>
    </main>
  );
}
