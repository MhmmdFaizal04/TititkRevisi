"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

const inputClass =
  "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fb923c]/50 focus:border-[#fb923c]/50 transition-all text-sm font-[var(--font-bricolage)]";
const labelClass =
  "text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-widest";

export default function AuthCard({ defaultMode }: { defaultMode: Mode }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [flipping, setFlipping] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [form, setForm] = useState({
    full_name: "", email: "", university: "", major: "",
    password: "", confirm_password: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  function setField(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  // GSAP entrance
  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 32, rotateY: -8 },
        { opacity: 1, y: 0, rotateY: 0, duration: 0.7, ease: "power3.out" }
      );
    },
    { scope: cardRef }
  );

  function flip(to: Mode) {
    if (flipping || to === mode) return;
    setFlipping(true);

    const card = cardRef.current;
    if (!card) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setMode(to);
        // Flip back from -90
        gsap.to(card, {
          rotateY: 0,
          duration: 0.4,
          ease: "power3.out",
          onComplete: () => setFlipping(false),
        });
      },
    });

    tl.to(card, {
      rotateY: 90,
      duration: 0.35,
      ease: "power3.in",
    });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setLoginError("Email atau password salah.");
      setLoginLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");
    if (form.password !== form.confirm_password) {
      setRegisterError("Password tidak cocok.");
      return;
    }
    if (form.password.length < 8) {
      setRegisterError("Password minimal 8 karakter.");
      return;
    }
    setRegisterLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setRegisterError(error.message);
      setRegisterLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").update({
        full_name: form.full_name,
        university: form.university,
        major: form.major,
      }).eq("id", data.user.id);
    }
    router.push("/payment");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-[#0d0d0d] border-r border-white/5 flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#fb923c]/6 blur-[120px]" />
        </div>
        <Link href="/" className="relative z-10 font-[var(--font-bricolage)] font-bold text-2xl text-white">
          TitikRevisi
        </Link>
        <div className="relative z-10">
          <p className="text-4xl font-bold font-[var(--font-bricolage)] text-white leading-snug">
            Selesaikan skripsimu
            <br />
            <span className="text-[#fb923c]">lebih cepat.</span>
          </p>
          <p className="mt-4 text-gray-500 text-sm font-[var(--font-bricolage)] leading-relaxed max-w-xs">
            Akses ebook prompt AI, template Excel, panduan bab per bab, dan
            template PPT sidang — bayar sekali seumur hidup.
          </p>
          {/* Floating feature pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {["500+ Prompt AI", "Template Excel", "Panduan Skripsi", "Template PPT"].map((f) => (
              <span
                key={f}
                className="glass px-3 py-1.5 rounded-full text-xs font-[var(--font-dm-mono)] text-gray-400"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#fb923c","#6366f1","#10b981","#f43f5e"].map((c) => (
              <div key={c} className="w-7 h-7 rounded-full border-2 border-[#0d0d0d]" style={{ background: c }} />
            ))}
          </div>
          <span className="text-xs text-gray-600 font-[var(--font-dm-mono)]">1.200+ mahasiswa bergabung</span>
        </div>
      </div>

      {/* Right: card with flip */}
      <div className="flex-1 flex items-center justify-center px-6 py-16" style={{ perspective: "1200px" }}>
        <div
          ref={cardRef}
          className="w-full max-w-md"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="font-[var(--font-bricolage)] font-bold text-xl text-white">
              TitikRevisi
            </Link>
          </div>

          {mode === "login" ? (
            <div ref={frontRef}>
              <div className="mb-7">
                <p className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] uppercase tracking-widest mb-1">
                  Selamat datang kembali
                </p>
                <h1 className="text-3xl font-bold font-[var(--font-bricolage)] text-white">Masuk</h1>
                <p className="mt-1 text-gray-500 text-sm font-[var(--font-bricolage)]">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => flip("register")}
                    className="text-[#fb923c] hover:underline font-medium"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="glass border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl font-[var(--font-bricolage)]">
                    {loginError}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className={labelClass}>Email</label>
                  <input type="email" className={inputClass} placeholder="email@kampus.ac.id"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Password</label>
                  <input type="password" className={inputClass} placeholder="••••••••"
                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-[#fb923c] hover:bg-[#ea580c] disabled:opacity-50 text-white font-semibold font-[var(--font-dm-mono)] text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-1"
                >
                  {loginLoading ? "Memverifikasi..." : "Masuk"}
                </button>
              </form>
            </div>
          ) : (
            <div ref={backRef}>
              <div className="mb-7">
                <p className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] uppercase tracking-widest mb-1">
                  Mulai perjalananmu
                </p>
                <h1 className="text-3xl font-bold font-[var(--font-bricolage)] text-white">Daftar</h1>
                <p className="mt-1 text-gray-500 text-sm font-[var(--font-bricolage)]">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => flip("login")}
                    className="text-[#fb923c] hover:underline font-medium"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                {registerError && (
                  <div className="glass border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl font-[var(--font-bricolage)]">
                    {registerError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label className={labelClass}>Nama Lengkap</label>
                    <input type="text" className={inputClass} placeholder="Nama sesuai KTP"
                      value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} required />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} placeholder="email@kampus.ac.id"
                      value={form.email} onChange={(e) => setField("email", e.target.value)} required autoComplete="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Perguruan Tinggi</label>
                    <input type="text" className={inputClass} placeholder="Universitas..."
                      value={form.university} onChange={(e) => setField("university", e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Program Studi</label>
                    <input type="text" className={inputClass} placeholder="Prodi..."
                      value={form.major} onChange={(e) => setField("major", e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Password</label>
                    <input type="password" className={inputClass} placeholder="Min. 8 karakter"
                      value={form.password} onChange={(e) => setField("password", e.target.value)} required autoComplete="new-password" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Konfirmasi</label>
                    <input type="password" className={inputClass} placeholder="Ulangi password"
                      value={form.confirm_password} onChange={(e) => setField("confirm_password", e.target.value)} required autoComplete="new-password" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full py-3.5 bg-[#fb923c] hover:bg-[#ea580c] disabled:opacity-50 text-white font-semibold font-[var(--font-dm-mono)] text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-1"
                >
                  {registerLoading ? "Mendaftarkan..." : "Daftar Sekarang — Rp 69.000"}
                </button>
                <p className="text-xs text-gray-600 text-center font-[var(--font-bricolage)]">
                  Setelah daftar, kamu akan diarahkan ke halaman pembayaran.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
