"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    // Verify admin
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!adminProfile) {
      await supabase.auth.signOut();
      setError("Akun ini tidak memiliki akses admin.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0d0d0d] border-r border-white/5 flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#fb923c]/6 blur-[120px]" />
        </div>
        <div className="relative z-10">
          <span className="font-[var(--font-bricolage)] font-bold text-2xl text-white tracking-tight">
            TitikRevisi
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-4xl font-bold font-[var(--font-bricolage)] text-white leading-tight">
            Panel kontrol
            <br />
            <span className="text-[#fb923c]">admin.</span>
          </p>
          <p className="mt-4 text-gray-500 font-[var(--font-bricolage)] text-sm leading-relaxed max-w-xs">
            Kelola pembayaran, konten, dan pengaturan platform dari satu tempat.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#fb923c]" />
          <span className="text-xs font-[var(--font-dm-mono)] text-gray-600 uppercase tracking-widest">
            Akses terbatas
          </span>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo (mobile only) */}
          <div className="lg:hidden mb-8">
            <span className="font-[var(--font-bricolage)] font-bold text-xl text-white">
              TitikRevisi
            </span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] uppercase tracking-widest mb-2">
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold font-[var(--font-bricolage)] text-white">
              Masuk
            </h1>
            <p className="mt-1 text-gray-500 text-sm font-[var(--font-bricolage)]">
              Hanya untuk akun dengan akses admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="glass border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl font-[var(--font-bricolage)]">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fb923c]/50 focus:border-[#fb923c]/50 transition-all font-[var(--font-bricolage)] text-sm"
                placeholder="admin@titikrevisi.com"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fb923c]/50 focus:border-[#fb923c]/50 transition-all font-[var(--font-bricolage)] text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#fb923c] hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold font-[var(--font-dm-mono)] text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-2"
            >
              {loading ? "Memverifikasi..." : "Masuk sebagai Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

