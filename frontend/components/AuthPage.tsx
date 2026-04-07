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
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`absolute top-8 right-8 p-2.5 rounded-lg border transition-all duration-200 ${
          theme === "dark"
            ? "border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
            : "border-blue-200 bg-white/50 hover:bg-white text-slate-600"
        }`}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div
            className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-900 border border-slate-800"
                : "bg-white border border-blue-100"
            }`}
          >
            {/* Header */}
            <div
              className={`px-8 pt-12 pb-8 text-center ${
                theme === "dark"
                  ? "bg-gradient-to-b from-slate-800 to-slate-900/50"
                  : "bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-500"
              }`}
            >
              <p
                className={`text-sm font-semibold mb-3 tracking-wider uppercase ${
                  theme === "dark"
                    ? "text-slate-300"
                    : "text-white/90"
                }`}
              >
                Premium Learning Platform
              </p>
              <h1
                className={`text-6xl md:text-7xl font-black mb-4 ${
                  theme === "dark" ? "text-white" : "text-white drop-shadow-lg"
                }`}
              >
                Pramyan
              </h1>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              {loading ? (
                <div className="space-y-4">
                  <div
                    className={`h-12 rounded-lg animate-pulse ${
                      theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                    }`}
                  />
                  <p
                    className={`text-center text-sm ${
                      theme === "dark"
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    Loading...
                  </p>
                </div>
              ) : user ? (
                <div className="text-center">
                  <p
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    Redirecting to dashboard...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p
                      className={`text-sm text-center ${
                        theme === "dark"
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      Sign in to your learning journey
                    </p>
                  </div>

                  {/* Google button */}
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className={`w-full px-4 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 border-2 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                        : "bg-white border-2 border-blue-600 text-slate-900 hover:bg-blue-50"
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div
                    className={`text-xs text-center ${
                      theme === "dark"
                        ? "text-slate-500"
                        : "text-slate-500"
                    }`}
                  >
                    Join thousands of learners worldwide
                  </div>
                </div>
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
          </div>

          {/* Footer text */}
          <p
            className={`text-center text-xs mt-8 ${
              theme === "dark" ? "text-slate-500" : "text-slate-600"
            }`}
          >
            Built for secure, modern learning
          </p>
        </div>
      </div>
    </main>
  );
}
