"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SiteSettings {
  qris_image_url: string;
  price_original: string;
  price_promo: string;
  whatsapp_number: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>({
    qris_image_url: "",
    price_original: "250000",
    price_promo: "69000",
    whatsapp_number: "6281234567890",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: settingsRows } = await supabase
        .from("site_settings")
        .select("key, value");

      if (settingsRows) {
        const map = Object.fromEntries(
          settingsRows.map((r) => [r.key, r.value ?? ""])
        ) as unknown as SiteSettings;
        setSettings((prev) => ({ ...prev, ...map }));
      }

      // Redirect if already confirmed
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("payment_status")
          .eq("id", user.id)
          .single();

        if (profile?.payment_status === "confirmed") {
          router.push("/dashboard");
        } else if (profile?.payment_status === "pending") {
          router.push("/payment/success");
        }
      }
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Silakan pilih foto bukti pembayaran.");
      return;
    }
    setError("");
    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    // Upload to Cloudinary via API route
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("folder", "titikrevisi/payment-proofs");

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadForm,
    });

    if (!uploadRes.ok) {
      setError("Gagal upload foto. Coba lagi.");
      setUploading(false);
      return;
    }

    const { url: publicUrl } = await uploadRes.json();

    const { error: insertError } = await supabase.from("payments").insert({
      user_id: user.id,
      qris_proof_url: publicUrl,
      status: "pending",
    });

    if (insertError) {
      setError("Gagal menyimpan data pembayaran. Coba lagi.");
      setUploading(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({ payment_status: "pending" })
      .eq("id", user.id);

    router.push("/payment/success");
  }

  const formatRp = (val: string) =>
    `Rp ${parseInt(val || "0", 10).toLocaleString("id-ID")}`;

  return (
    <div className="min-h-screen pt-14 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold font-[var(--font-bricolage)] text-white">
          Pembayaran
        </h1>
        <p className="mt-2 text-gray-400 font-[var(--font-bricolage)]">
          Scan QRIS di bawah, lalu upload bukti pembayaran.
        </p>

        {/* Price */}
        <div className="mt-6 glass rounded-2xl p-5 flex items-center gap-6">
          <div>
            <p className="text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-widest mb-1">
              Total Pembayaran
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold font-[var(--font-bricolage)] text-[#fb923c]">
                {formatRp(settings.price_promo)}
              </span>
              <span className="text-lg font-[var(--font-bricolage)] text-gray-600 price-original mb-0.5">
                {formatRp(settings.price_original)}
              </span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <span className="inline-block bg-[#fb923c]/10 border border-[#fb923c]/40 text-[#fb923c] text-xs font-[var(--font-dm-mono)] px-3 py-1 uppercase tracking-wide">
              Bayar Sekali
            </span>
          </div>
        </div>

        {/* QRIS Image */}
        {settings.qris_image_url && (
          <div className="mt-8 glass rounded-2xl p-6 text-center">
            <p className="text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-widest mb-4">
              Scan QRIS untuk membayar
            </p>
            <img
              src={settings.qris_image_url}
              alt="QRIS pembayaran TitikRevisi"
              className="mx-auto max-w-xs w-full"
            />
          </div>
        )}

        {!settings.qris_image_url && (
          <div className="mt-8 border border-dashed border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-600 font-[var(--font-bricolage)] text-sm">
              Gambar QRIS sedang disiapkan. Silakan hubungi CS.
            </p>
          </div>
        )}

        {/* Upload Proof */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <p className="text-sm font-[var(--font-dm-mono)] text-gray-400 uppercase tracking-wide">
            Upload Bukti Pembayaran
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="cursor-pointer"
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" loading={uploading} className="w-full" size="lg">
            Kirim Bukti Pembayaran
          </Button>
        </form>

        <p className="mt-6 text-xs text-gray-600 font-[var(--font-bricolage)]">
          Pembayaran dikonfirmasi manual oleh admin dalam 1x24 jam. Kamu akan
          mendapat email konfirmasi setelah akses diaktifkan.
        </p>
      </div>
    </div>
  );
}

