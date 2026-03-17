export default function AdminPage() {
  return (
    <main className="grid" style={{ gap: 16 }}>
      <h1>Admin Panel</h1>
      <section className="card">
        <h3>Listing Moderation</h3>
        <p>Approve or reject gemstone listings before they are visible in the marketplace.</p>
      </section>
      <section className="card">
        <h3>User Management</h3>
        <p>Review user accounts, roles, and activity.</p>
      </section>
      <section className="card">
        <h3>Transactions and Analytics</h3>
        <p>Monitor orders, payment events, and platform KPIs.</p>
      </section>
    </main>
  );
}
