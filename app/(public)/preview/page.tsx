import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

const features = [
  {
    type: "ebook_prompt",
    label: "Ebook Prompt AI",
    variant: "orange" as const,
    title: "500+ Prompt AI Siap Pakai",
    description: "Prompt untuk latar belakang, tinjauan pustaka, metodologi, hingga pembahasan hasil.",
    count: "500+ prompt",
  },
  {
    type: "ebook_excel",
    label: "Template Excel",
    variant: "green" as const,
    title: "Template Analisis Data",
    description: "Uji validitas, reliabilitas, regresi, dan analisis deskriptif — tinggal input data.",
    count: "12 template",
  },
  {
    type: "ebook_pelajaran",
    label: "Panduan Skripsi",
    variant: "gray" as const,
    title: "Panduan Bab per Bab",
    description: "Ebook step-by-step dari proposal hingga sidang, bahasa mudah dipahami.",
    count: "8 ebook",
  },
  {
    type: "template_ppt",
    label: "Template PPT",
    variant: "black" as const,
    title: "Template Presentasi Sidang",
    description: "Desain profesional, layout sudah terstruktur, tinggal ganti konten.",
    count: "6 template",
  },
];

export default async function PreviewDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, payment_status")
    .eq("id", user.id)
    .returns<{ full_name: string | null; payment_status: string | null }[]>()
    .single();

  // If confirmed, go to real dashboard
  if (profile?.payment_status === "confirmed") redirect("/dashboard");
  // If pending, go to waiting page
  if (profile?.payment_status === "pending") redirect("/payment/success");

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-14">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] uppercase tracking-widest">
            Preview
          </p>
          <h1 className="mt-2 text-3xl font-bold font-[var(--font-bricolage)] text-white">
            Halo, {profile?.full_name ?? "Mahasiswa"}
          </h1>
          <p className="mt-1 text-gray-400 font-[var(--font-bricolage)]">
            Ini adalah preview konten yang bisa kamu akses setelah melakukan pembayaran.
          </p>
        </div>

        {/* Locked banner */}
        <div className="glass-orange rounded-2xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-[#fb923c] text-xl mt-0.5">⚡</span>
            <div>
              <p className="text-white font-semibold font-[var(--font-bricolage)]">
                Akses terkunci
              </p>
              <p className="text-gray-400 text-sm font-[var(--font-bricolage)] mt-0.5">
                Bayar sekali Rp 69.000 untuk akses seumur hidup ke semua konten.
              </p>
            </div>
          </div>
          <Link
            href="/payment"
            className="flex-shrink-0 px-6 py-3 bg-[#fb923c] text-white text-sm font-[var(--font-dm-mono)] font-medium hover:bg-[#ea580c] transition-all rounded-xl shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            Bayar Sekarang
          </Link>
        </div>

        {/* Feature cards — blurred/locked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.type}
              className="glass rounded-2xl p-6 flex flex-col relative overflow-hidden"
            >
              {/* Lock overlay */}
              <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2 rounded-2xl">
                <div className="glass-strong rounded-xl px-4 py-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#fb923c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-[var(--font-dm-mono)] text-white">Perlu pembayaran</span>
                </div>
              </div>

              {/* Content (blurred behind) */}
              <Badge variant={f.variant} className="self-start mb-3">
                {f.label}
              </Badge>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold font-[var(--font-bricolage)] text-white">
                  {f.title}
                </h3>
                <span className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] bg-[#fb923c]/10 px-2 py-1 rounded-lg whitespace-nowrap">
                  {f.count}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400 font-[var(--font-bricolage)] leading-relaxed">
                {f.description}
              </p>
              <div className="mt-5 h-9 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Pricing CTA bottom */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm font-[var(--font-bricolage)] mb-4">
            Sudah kirim bukti pembayaran?
          </p>
          <Link
            href="/payment/success"
            className="text-[#fb923c] text-sm font-[var(--font-dm-mono)] hover:underline"
          >
            Cek status pembayaran
          </Link>
        </div>
      </div>
    </div>
  );
}
