"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("payment_status")
        .eq("id", user.id)
        .single();

      if (profile?.payment_status === "confirmed") {
        router.push("/dashboard");
        return;
      }

      setStatus(profile?.payment_status ?? "pending");
    }

    checkStatus();
  }, [router]);

  return (
    <div className="min-h-screen pt-14 bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-md w-full glass-strong rounded-2xl p-10 text-center">
        <div className="w-12 h-12 border-2 border-[#fb923c] mx-auto mb-6 flex items-center justify-center">
          <span className="w-3 h-3 bg-[#fb923c] rounded-full animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold font-[var(--font-bricolage)] text-white">
          Pembayaran Sedang Diverifikasi
        </h1>
        <p className="mt-3 text-gray-400 font-[var(--font-bricolage)] text-sm leading-relaxed">
          Terima kasih. Bukti pembayaranmu sudah kami terima dan sedang
          diverifikasi oleh admin. Proses konfirmasi membutuhkan waktu hingga
          1x24 jam.
        </p>
        {status === "rejected" && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3">
            Pembayaranmu ditolak. Silakan hubungi CS untuk informasi lebih
            lanjut.
          </div>
        )}
        <p className="mt-6 text-xs text-gray-600 font-[var(--font-dm-mono)]">
          Kamu akan mendapat email konfirmasi saat akses sudah aktif.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="text-sm font-[var(--font-dm-mono)] text-[#fb923c] hover:underline"
          >
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}

