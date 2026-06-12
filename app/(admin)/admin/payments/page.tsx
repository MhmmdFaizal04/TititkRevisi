import { createClient } from "@/lib/supabase/server";
import PaymentsClient from "@/components/admin/PaymentsClient";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select(`
      id,
      user_id,
      qris_proof_url,
      status,
      admin_notes,
      confirmed_at,
      created_at,
      profiles:profiles(full_name, email, university)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-[var(--font-bricolage)] text-[#0a0a0a] mb-6">
        Manajemen Pembayaran
      </h1>
      <PaymentsClient payments={payments ?? []} />
    </div>
  );
}

