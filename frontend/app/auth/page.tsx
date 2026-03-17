"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";
import { parseUserFromToken, setToken } from "../../lib/auth";

type AuthMode = "register" | "login";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cta = useMemo(() => (mode === "register" ? "Create Account" : "Login"), [mode]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "register") {
        const created = await apiRequest<{ id: string; email: string; role: "USER" | "ADMIN" }>("/register", {
          method: "POST",
          body: { name, email, password },
        });
        setMessage(`Account created (${created.role}). Please login now.`);
        setMode("login");
      } else {
        const result = await apiRequest<{ token: string }>("/login", {
          method: "POST",
          body: { email, password },
        });
        setToken(result.token);
        const user = parseUserFromToken(result.token);
        setMessage(`Logged in successfully as ${user?.role ?? "USER"}.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid" style={{ gap: 16 }}>
      <h1>Account Access</h1>
      <section className="card">
        <div className="links" style={{ marginBottom: 12 }}>
          <button className="btn" type="button" onClick={() => setMode("register")}>Register</button>
          <button className="btn" type="button" onClick={() => setMode("login")}>Login</button>
        </div>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          {mode === "register" ? (
            <label>
              Full name
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </label>
          ) : null}
          <label>
            Email
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </label>
          <button className="btn" disabled={loading} type="submit">
            {loading ? "Please wait..." : cta}
          </button>
        </form>
        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
      </section>
    </main>
  );
}
