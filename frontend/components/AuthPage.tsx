"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type User = {
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthPage() {
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
          if (response.status !== 401) {
            throw new Error("Could not fetch profile");
          }
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        setError("Unable to reach authentication server.");
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  function loginWithGoogle() {
    window.location.href = `${apiUrl}/api/auth/google`;
  }

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

      setUser(null);
      setError("");
    } catch {
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Image
                src={user.profilePicture || "/avatar-placeholder.svg"}
                alt={user.name}
                width={96}
                height={96}
                className="h-16 w-16 rounded-full object-cover"
              />

              <div>
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  {user.name}
                </h2>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {user.email}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Account created: {accountCreatedAt}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className={`w-full rounded-md px-4 py-2 text-sm font-medium ${
                theme === "dark"
                  ? "bg-slate-100 text-slate-900 hover:bg-slate-300"
                  : "bg-slate-900 text-white hover:bg-slate-700"
              }`}
            >
              Logout
            </button>
          </div>
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
