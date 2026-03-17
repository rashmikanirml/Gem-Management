export default function SellerDashboardPage() {
  return (
    <main className="grid" style={{ gap: 16 }}>
      <h1>Seller Dashboard</h1>
      <section className="card">
        <h3>Create Listing</h3>
        <p>Add gemstone details including type, carats, color, clarity, origin, certification, and price.</p>
      </section>
      <section className="card">
        <h3>Listing Status</h3>
        <p>Track pending, approved, rejected, and sold gemstones.</p>
      </section>
      <section className="card">
        <h3>Order Management</h3>
        <p>Manage buyer orders and fulfillment updates.</p>
      </section>
    </main>
  );
}
