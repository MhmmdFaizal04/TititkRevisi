"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Props {
  settings: Record<string, string>;
}

export default function SettingsClient({ settings }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    qris_image_url: settings.qris_image_url ?? "",
    price_original: settings.price_original ?? "250000",
    price_promo: settings.price_promo ?? "69000",
    whatsapp_number: settings.whatsapp_number ?? "",
  });
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const supabase = createClient();

    let qrisUrl = form.qris_image_url;

    // Upload QRIS image if new file selected
    if (qrisFile) {
      const uploadForm = new FormData();
      uploadForm.append("file", qrisFile);
      uploadForm.append("folder", "titikrevisi/qris");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        qrisUrl = url;
      }
    }

    const updates = [
      { key: "qris_image_url", value: qrisUrl },
      { key: "price_original", value: form.price_original },
      { key: "price_promo", value: form.price_promo },
      { key: "whatsapp_number", value: form.whatsapp_number },
    ];

    for (const u of updates) {
      await supabase
        .from("site_settings")
        .update({ value: u.value, updated_at: new Date().toISOString() })
        .eq("key", u.key);
    }

    setForm((f) => ({ ...f, qris_image_url: qrisUrl }));
    setQrisFile(null);
    setLoading(false);
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {success && (
        <div className="bg-green-900/30 border border-green-500/50 text-green-400 text-sm px-4 py-3">
          Pengaturan berhasil disimpan.
        </div>
      )}

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-[var(--font-dm-mono)] uppercase tracking-widest text-gray-500">
          Harga
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Harga Asli (Rp)"
            type="number"
            value={form.price_original}
            onChange={(e) => setForm((f) => ({ ...f, price_original: e.target.value }))}
            placeholder="250000"
          />
          <Input
            label="Harga Promo (Rp)"
            type="number"
            value={form.price_promo}
            onChange={(e) => setForm((f) => ({ ...f, price_promo: e.target.value }))}
            placeholder="69000"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-[var(--font-dm-mono)] uppercase tracking-widest text-gray-500">
          QRIS Pembayaran
        </h2>
        {form.qris_image_url && (
          <img
            src={form.qris_image_url}
            alt="QRIS saat ini"
            className="max-w-[200px] border border-[#2a2a2a]"
          />
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium font-[var(--font-dm-mono)] text-gray-300">
            Upload Gambar QRIS Baru
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrisFile(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border file:border-[#2a2a2a] file:bg-[#0a0a0a] file:text-gray-300 file:font-[var(--font-dm-mono)] file:text-xs file:cursor-pointer"
          />
        </div>
        <Input
          label="Atau masukkan URL gambar QRIS"
          type="url"
          value={form.qris_image_url}
          onChange={(e) => setForm((f) => ({ ...f, qris_image_url: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-[var(--font-dm-mono)] uppercase tracking-widest text-gray-500">
          WhatsApp CS
        </h2>
        <Input
          label="Nomor WhatsApp (format: 628xxx)"
          type="text"
          value={form.whatsapp_number}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))}
          placeholder="6281234567890"
        />
      </div>

      <Button type="submit" loading={loading} size="lg">
        Simpan Pengaturan
      </Button>
    </form>
  );
}

