"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type PaymentRow = {
  id: string;
  user_id: string;
  qris_proof_url: string | null;
  status: string;
  admin_notes: string | null;
  confirmed_at: string | null;
  created_at: string;
  profiles: { full_name: string | null; email: string | null; university: string | null } | null;
};

const statusBadge = {
  pending: "orange" as const,
  confirmed: "green" as const,
  rejected: "red" as const,
};

export default function PaymentsClient({ payments }: { payments: PaymentRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<PaymentRow | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [proofModal, setProofModal] = useState<string | null>(null);

  async function handleAction(action: "confirmed" | "rejected") {
    if (!selected) return;
    setLoading(true);
    const supabase = createClient();

    const updateData: {
      status: "confirmed" | "rejected";
      admin_notes: string | null;
      confirmed_at?: string | null;
    } = {
      status: action,
      admin_notes: notes || null,
    };
    if (action === "confirmed") {
      updateData.confirmed_at = new Date().toISOString();
    }

    await supabase.from("payments").update(updateData).eq("id", selected.id);

    if (action === "confirmed") {
      await supabase
        .from("profiles")
        .update({ payment_status: "confirmed" })
        .eq("id", selected.user_id);

      // Trigger Edge Function email
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: selected.user_id }),
        }
      ).catch(() => {
        // Edge function may not be deployed yet — non-blocking
      });
    } else {
      await supabase
        .from("profiles")
        .update({ payment_status: "rejected" })
        .eq("id", selected.user_id);
    }

    setSelected(null);
    setNotes("");
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <div className="overflow-x-auto glass rounded-2xl">
        <table className="w-full text-sm font-[var(--font-bricolage)]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {["Nama", "Email", "Universitas", "Tanggal", "Status", "Aksi"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-[var(--font-dm-mono)] uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white">
                  {p.profiles?.full_name ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-400">{p.profiles?.email ?? "-"}</td>
                <td className="px-4 py-3 text-gray-400">
                  {p.profiles?.university ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-[var(--font-dm-mono)] text-xs">
                  {new Date(p.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadge[p.status as keyof typeof statusBadge] ?? "gray"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {p.qris_proof_url && (
                      <button
                        onClick={() => setProofModal(p.qris_proof_url!)}
                        className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] hover:underline"
                      >
                        Lihat Bukti
                      </button>
                    )}
                    {p.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelected(p);
                          setNotes("");
                        }}
                        className="text-xs font-[var(--font-dm-mono)] text-[#0a0a0a] hover:text-[#fb923c] underline"
                      >
                        Tinjau
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-600">
                  Belum ada data pembayaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Tinjau Pembayaran"
      >
        {selected && (
          <div className="space-y-4">
            <div className="text-sm font-[var(--font-bricolage)] space-y-1 text-gray-300">
              <p><span className="text-gray-500">Nama:</span> {selected.profiles?.full_name}</p>
              <p><span className="text-gray-500">Email:</span> {selected.profiles?.email}</p>
              <p><span className="text-gray-500">Universitas:</span> {selected.profiles?.university}</p>
            </div>
            {selected.qris_proof_url && (
              <img
                src={selected.qris_proof_url}
                alt="Bukti pembayaran"
                className="w-full max-h-64 object-contain border border-gray-200"
              />
            )}
            <div>
              <label className="text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-wide block mb-1">
                Catatan admin (opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Contoh: Bukti tidak valid..."
                className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#fb923c] resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                loading={loading}
                onClick={() => handleAction("confirmed")}
                className="flex-1"
              >
                Konfirmasi
              </Button>
              <Button
                variant="danger"
                loading={loading}
                onClick={() => handleAction("rejected")}
                className="flex-1"
              >
                Tolak
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Proof image modal */}
      <Modal open={!!proofModal} onClose={() => setProofModal(null)} title="Bukti Pembayaran">
        {proofModal && (
          <img src={proofModal} alt="Bukti pembayaran" className="w-full" />
        )}
      </Modal>
    </>
  );
}

