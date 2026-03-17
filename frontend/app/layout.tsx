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
