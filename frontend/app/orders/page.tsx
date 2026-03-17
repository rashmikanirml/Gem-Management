export default function OrdersPage() {
  return (
    <main className="grid" style={{ gap: 16 }}>
      <h1>Order Tracking</h1>
      <section className="card">
        <h3>Order History</h3>
        <p>View all purchases, payment status, and timeline updates.</p>
      </section>
      <section className="card">
        <h3>Messaging</h3>
        <p>Contact sellers regarding shipment, documents, and support requests.</p>
      </section>
    </main>
  );
}
