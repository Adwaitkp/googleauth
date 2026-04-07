"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const accountCreatedAt = useMemo(() => {
    if (!user?.createdAt) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(user.createdAt));
  }, [user?.createdAt]);

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
          router.replace("/");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        setError("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, [router]);

  async function logout() {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/");
    } catch {
      setError("Logout failed. Please try again.");
      setLoading(false);
    }
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-slate-100"}`}>
      <header
        className={`border-b backdrop-blur ${
          theme === "dark" ? "border-slate-800 bg-slate-900/95" : "border-slate-200 bg-white/95"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className={`text-lg font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
            Dashboard
          </p>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Image
                  src={user.profilePicture || "/avatar-placeholder.svg"}
                  alt={user.name}
                  width={40}
                  height={40}
                  className={`h-10 w-10 rounded-full object-cover ${
                    theme === "dark" ? "border border-slate-700" : "border border-slate-200"
                  }`}
                />
                <div className="hidden text-left sm:block">
                  <p className={`text-sm font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    {user.email}
                  </p>
                </div>
              </>
            ) : null}

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

            <button
              type="button"
              onClick={logout}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-xl text-center">
          {loading ? (
            <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>Loading dashboard...</p>
          ) : user ? (
            <div>
              <p className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                Welcome back
              </p>
              <h2 className={`mt-1 text-3xl font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                {user.name}
              </h2>
              <p className={theme === "dark" ? "text-base text-slate-300" : "text-base text-slate-700"}>
                Account created: {accountCreatedAt}
              </p>
            </div>
          ) : (
            <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>Redirecting to login...</p>
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
        </div>
      </section>
    </main>
  );
}
