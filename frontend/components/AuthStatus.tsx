"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { clearToken, getToken, parseUserFromToken } from "../lib/auth";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export default function AuthStatus() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const token = getToken();
      if (!token) {
        setProfile(null);
        return;
      }

      const user = parseUserFromToken(token);
      if (!user) {
        clearToken();
        setProfile(null);
        return;
      }

      try {
        const data = await apiRequest<Profile>("/users/profile", { auth: true });
        setProfile(data);
      } catch {
        clearToken();
        setProfile(null);
      }
    }

    void loadProfile();
  }, []);

  if (!profile) {
    return <span className="badge">Guest</span>;
  }

  return (
    <div className="auth-status">
      <span className="badge">{profile.role}</span>
      <span className="auth-text">{profile.email}</span>
      <button
        type="button"
        className="btn"
        onClick={() => {
          clearToken();
          window.location.href = "/auth";
        }}
      >
        Logout
      </button>
    </div>
  );
}
