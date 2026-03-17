import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Gem Marketplace",
  description: "Buy and sell certified gemstones",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gems" aria-hidden="true">
          <span className="gem-bubble b1" />
          <span className="gem-bubble b2" />
          <span className="gem-bubble b3" />
          <span className="gem-bubble b4" />
          <span className="gem-bubble b5" />
          <span className="gem-bubble b6" />
          <span className="gem-bubble b7" />
          <span className="gem-bubble b8" />
        </div>
        <div className="container">
          <header className="nav">
            <strong>Gem Marketplace</strong>
            <nav className="links">
              <Link href="/">Marketplace</Link>
              <Link href="/seller">Seller</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
