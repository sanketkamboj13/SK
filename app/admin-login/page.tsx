"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <p className="eyebrow">S.K / ADMIN</p>

        <h1 style={{ marginBottom: "10px" }}>
          ADMIN LOGIN
        </h1>

        <p style={{ marginBottom: "30px" }}>
          Sign in to access the S.K Command Center.
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: "15px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: "20px",
            }}
          />

          {error && (
            <p style={{ marginBottom: "20px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn full"
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "LOGIN"}
          </button>

        </form>
      </div>
    </main>
  );
}