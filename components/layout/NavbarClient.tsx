"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  isLoggedIn: boolean;
  paymentStatus: string | null;
}

export default function NavbarClient({ isLoggedIn, paymentStatus }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isConfirmed = paymentStatus === "confirmed";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-[var(--font-bricolage)] font-bold text-xl tracking-tight text-white"
        >
          TitikRevisi
        </Link>

        <div className="flex items-center gap-6">
          {/* Public nav links — hide on auth pages */}
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
            /* Logged-in state */
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
            /* Guest state — hide on auth pages */
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
      </nav>
    </header>
  );
}
