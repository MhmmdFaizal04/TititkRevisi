"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  isLoggedIn: boolean;
  paymentStatus: string | null;
}

export default function NavbarClient({ isLoggedIn, paymentStatus }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isConfirmed = paymentStatus === "confirmed";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMenu}
            className="font-[var(--font-bricolage)] font-bold text-xl tracking-tight text-white"
          >
            TitikRevisi
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthPage && (
              <>
                <Link
                  href="/#fitur"
                  className="text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] transition-colors"
                >
                  Fitur
                </Link>
                <Link
                  href="/#harga"
                  className="text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] transition-colors"
                >
                  Harga
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {isConfirmed ? (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/preview"
                    className="text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] transition-colors"
                  >
                    Preview
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 glass border border-white/10 text-gray-400 text-sm font-medium font-[var(--font-dm-mono)] hover:text-white hover:border-white/20 transition-all rounded-xl"
                >
                  Keluar
                </button>
              </div>
            ) : (
              !isAuthPage && (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-[#fb923c] text-white text-sm font-medium font-[var(--font-dm-mono)] hover:bg-[#ea580c] transition-colors rounded-xl"
                  >
                    Daftar
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile hamburger — hidden on auth pages */}
          {!isAuthPage && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          )}
        </nav>
      </header>

      {/* Mobile menu drawer */}
      {!isAuthPage && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Slide-down panel */}
          <div
            className={`fixed top-14 left-0 right-0 z-30 bg-[#0a0a0a] border-b border-white/10 md:hidden transition-all duration-300 overflow-hidden ${
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              <Link
                href="/#fitur"
                onClick={closeMenu}
                className="py-3 text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] border-b border-white/5 transition-colors"
              >
                Fitur
              </Link>
              <Link
                href="/#harga"
                onClick={closeMenu}
                className="py-3 text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] border-b border-white/5 transition-colors"
              >
                Harga
              </Link>

              {isLoggedIn ? (
                <>
                  {isConfirmed ? (
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="py-3 text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] border-b border-white/5 transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/preview"
                      onClick={closeMenu}
                      className="py-3 text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] border-b border-white/5 transition-colors"
                    >
                      Preview
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mt-2 py-3 text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-white text-left transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="py-3 text-sm font-medium font-[var(--font-dm-mono)] text-gray-400 hover:text-[#fb923c] border-b border-white/5 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="mt-2 px-4 py-3 bg-[#fb923c] text-white text-sm font-medium font-[var(--font-dm-mono)] hover:bg-[#ea580c] transition-colors rounded-xl text-center"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
