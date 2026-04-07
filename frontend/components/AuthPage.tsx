"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
};

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://googleauth-kpae.onrender.com"
    : "http://localhost:5000";

export default function AuthPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status !== 401) {
            throw new Error("Could not fetch profile");
          }
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);
        router.replace("/dashboard");
      } catch {
        setError("Unable to reach authentication server.");
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, [router]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  function loginWithGoogle() {
    window.location.href = `${apiUrl}/api/auth/google`;
  }

  return (
    <main
      className={`flex min-h-screen items-center justify-center p-4 ${
        theme === "dark" ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <section
        className={`w-full max-w-md rounded-2xl border p-6 shadow-sm sm:p-8 ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1
            className={`text-2xl font-semibold ${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Google Auth
          </h1>

          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
              theme === "dark"
                ? "border-slate-700 text-slate-100 hover:bg-slate-800"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        {loading ? (
          <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
            Loading...
          </p>
        ) : user ? (
          <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
            Redirecting to dashboard...
          </p>
        ) : (
          <div className="space-y-3">
            <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
              Sign in to continue.
            </p>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Continue with Google
            </button>
          </div>
        )}

        {error && (
          <p
            className={`mt-4 rounded-md border px-3 py-2 text-sm ${
              theme === "dark"
                ? "border-red-800 bg-red-950/40 text-red-300"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
