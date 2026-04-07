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
    <main
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950"
          : "bg-slate-50"
      }`}
    >
      <header
        className={`border-b px-4 py-3 sm:px-6 ${
          theme === "dark"
            ? "border-slate-800 bg-slate-950/70"
            : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          <p
            className={`text-lg font-bold ${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Pramyan
          </p>

          <div className="flex items-center gap-3">
            {user ? (
              <Image
                src={user.profilePicture || "/avatar-placeholder.svg"}
                alt={user.name}
                width={36}
                height={36}
                className={`h-9 w-9 rounded-full object-cover border ${
                  theme === "dark"
                    ? "border-slate-700"
                    : "border-slate-200"
                }`}
              />
            ) : null}

            <button
              type="button"
              onClick={toggleTheme}
              className={`rounded-lg p-2 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.76 4.84l-1.8-1.79-1.42 1.42 1.79 1.79 1.43-1.42zm10.48 10.48l1.79 1.79 1.42-1.42-1.79-1.79-1.42 1.42zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zM4 12H1v-1h3v1zm19 0h-3v-1h3v1zM6.76 19.16l-1.43-1.42-1.79 1.79 1.42 1.42 1.8-1.79zM19.16 6.76l1.42-1.43-1.79-1.79-1.42 1.42 1.79 1.8zM12 6a6 6 0 100 12 6 6 0 000-12z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={logout}
              className={`rounded-lg p-2 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                  : "bg-red-100 hover:bg-red-200 text-red-600"
              }`}
              disabled={loading}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-5xl items-start px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl">
          <p
            className={`text-3xl font-bold mb-8 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Your Dashboard
          </p>

          {loading ? (
            <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
              Loading dashboard...
            </p>
          ) : user ? (
            <div
              className={`w-full max-w-[430px] rounded-2xl p-5 shadow-lg transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#111a33] border border-[#223055]"
                  : "bg-white border border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={user.profilePicture || "/avatar-placeholder.svg"}
                  alt={user.name}
                  width={54}
                  height={54}
                  className={`h-14 w-14 rounded-full object-cover border ${
                    theme === "dark" ? "border-slate-500" : "border-slate-200"
                  }`}
                />
                <div>
                  <h2
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {user.name}
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Pramyan Learner
                  </p>
                </div>
              </div>

              <div
                className={`space-y-3 text-sm ${
                  theme === "dark" ? "text-slate-200" : "text-slate-700"
                }`}
              >
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{accountCreatedAt}</p>
              </div>
            </div>
          ) : (
            <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
              Redirecting to login...
            </p>
          )}

          {error && (
            <div
              className={`mt-6 p-4 rounded-lg border text-sm ${
                theme === "dark"
                  ? "border-red-900 bg-red-950/30 text-red-400"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              ⚠️ {error}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
