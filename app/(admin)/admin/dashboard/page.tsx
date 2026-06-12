import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: pendingPayments },
    { count: confirmedUsers },
    { count: totalResources },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "confirmed"),
    supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const stats = [
    { label: "Total Pengguna", value: totalUsers ?? 0 },
    { label: "Menunggu Konfirmasi", value: pendingPayments ?? 0, highlight: true },
    { label: "Member Aktif", value: confirmedUsers ?? 0 },
    { label: "Konten Aktif", value: totalResources ?? 0 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-[var(--font-bricolage)] text-white mb-8">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl p-6 ${
              s.highlight
                ? "glass-orange"
                : "glass"
            }`}
          >
            <p className="text-xs font-[var(--font-dm-mono)] text-gray-500 uppercase tracking-wide">
              {s.label}
            </p>
            <p
              className={`mt-2 text-3xl font-bold font-[var(--font-bricolage)] ${
                s.highlight ? "text-[#fb923c]" : "text-[#0a0a0a]"
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

