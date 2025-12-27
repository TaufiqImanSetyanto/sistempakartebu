import React, { useState } from "react";
import Header from "../../components/Header";
import { useAdmin } from "../../context/AdminAuth";

export default function Login() {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const result = await login({ username, password });
    if (!result.ok) setErr(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md m-auto p-6">
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">
            Login Admin
          </h3>

          {err && <div className="text-red-600 mb-3">{err}</div>}

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full border border-gray-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-gray-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <button
              disabled={loading}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded w-full hover:opacity-90 transition"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
