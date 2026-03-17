const demoGems = [
  {
    name: "Natural Ruby",
    type: "Ruby",
    carats: "2.4",
    origin: "Myanmar",
    price: "$5,600",
  },
  {
    name: "Blue Sapphire",
    type: "Sapphire",
    carats: "3.1",
    origin: "Sri Lanka",
    price: "$6,900",
  },
  {
    name: "Emerald Oval Cut",
    type: "Emerald",
    carats: "1.9",
    origin: "Colombia",
    price: "$4,200",
  },
];

export default function MarketplacePage() {
  return (
    <main>
      <section className="card" style={{ marginBottom: 16 }}>
        <h1>Discover Verified Gemstones</h1>
        <p>
          Search, compare, and purchase stones from trusted sellers. Listing approval and
          secure order handling are managed through the platform admin tools.
        </p>
        <div className="links">
          <span className="badge">Search + Filters</span>
          <span className="badge">Wishlist</span>
          <span className="badge">Checkout</span>
        </div>
      </section>

      <section className="grid grid-3">
        {demoGems.map((gem) => (
          <article key={gem.name} className="card">
            <h3>{gem.name}</h3>
            <p>{gem.type}</p>
            <p>{gem.carats} ct</p>
            <p>{gem.origin}</p>
            <p>
              <strong>{gem.price}</strong>
            </p>
            <button className="btn">Add to cart</button>
          </article>
        ))}
      </section>
    </main>
  );
}
