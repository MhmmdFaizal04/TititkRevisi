import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Resource = Database["public"]["Tables"]["resources"]["Row"];
type ResourceType = Resource["type"];

const TABS: { key: ResourceType; label: string; ext: string; color: string; bg: string; lineColor: string }[] = [
  { key: "ebook_prompt",   label: "Ebook Prompt AI",  ext: "PDF",  color: "#fb923c", bg: "rgba(251,146,60,0.12)",  lineColor: "rgba(251,146,60,0.3)" },
  { key: "ebook_excel",    label: "Template Excel",    ext: "XLSX", color: "#4ade80", bg: "rgba(74,222,128,0.10)",  lineColor: "rgba(74,222,128,0.25)" },
  { key: "ebook_pelajaran",label: "Panduan Skripsi",   ext: "DOCX", color: "#60a5fa", bg: "rgba(96,165,250,0.10)",  lineColor: "rgba(96,165,250,0.25)" },
  { key: "template_ppt",   label: "Template PPT",      ext: "PPT",  color: "#f472b6", bg: "rgba(244,114,182,0.10)", lineColor: "rgba(244,114,182,0.25)" },
];

function FileIcon({ ext, color, bg }: { ext: string; color: string; bg: string }) {
  return (
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shadow */}
      <rect x="6" y="6" width="52" height="68" rx="6" fill="black" fillOpacity="0.3" />
      {/* Body */}
      <rect x="4" y="4" width="52" height="68" rx="6" fill={bg} />
      <rect x="4" y="4" width="52" height="68" rx="6" stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Folded corner */}
      <path d="M42 4 L56 18 L42 18 Z" fill={color} fillOpacity="0.25" />
      <path d="M42 4 L56 18 H42 V4Z" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
      {/* Lines */}
      <rect x="14" y="30" width="24" height="2.5" rx="1.25" fill={color} fillOpacity="0.5" />
      <rect x="14" y="38" width="32" height="2.5" rx="1.25" fill={color} fillOpacity="0.35" />
      <rect x="14" y="46" width="28" height="2.5" rx="1.25" fill={color} fillOpacity="0.35" />
      {/* Extension badge */}
      <rect x="10" y="55" width="44" height="13" rx="3" fill={color} fillOpacity="0.9" />
      <text x="32" y="65.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">
        {ext}
      </text>
    </svg>
  );
}

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab: ResourceType = (tab as ResourceType) || "ebook_prompt";
  const activeTabMeta = TABS.find((t) => t.key === activeTab)!;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .returns<{ full_name: string | null }[]>()
    .single();

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("type", activeTab)
    .eq("is_active", true)
    .order("order_index")
    .returns<Resource[]>();

  const firstName = profile?.full_name?.split(" ")[0] ?? "Mahasiswa";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero header */}
      <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] uppercase tracking-[0.2em] mb-2">
            Member Dashboard
          </p>
          <h1 className="text-4xl font-bold font-[var(--font-bricolage)] text-white">
            Halo, {firstName}! 👋
          </h1>
          <p className="mt-2 text-gray-500 font-[var(--font-bricolage)] text-sm">
            Akses penuh ke semua materi TitikRevisi — selamanya.
          </p>

          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap gap-4">
            {TABS.map((t) => (
              <div key={t.key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: t.bg, border: `1px solid ${t.lineColor}` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <span className="text-xs font-[var(--font-dm-mono)]" style={{ color: t.color }}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/dashboard?tab=${t.key}`}
              className={`px-5 py-2.5 text-sm font-[var(--font-dm-mono)] transition-all rounded-xl border ${
                activeTab === t.key
                  ? "text-white border-transparent"
                  : "text-gray-500 border-white/5 hover:text-white hover:border-white/15 bg-white/[0.02]"
              }`}
              style={activeTab === t.key ? { background: t.color, boxShadow: `0 4px 24px ${t.color}33` } : {}}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 rounded-full" style={{ background: activeTabMeta.color }} />
          <h2 className="text-base font-semibold font-[var(--font-bricolage)] text-white">
            {activeTabMeta.label}
          </h2>
          {resources && (
            <span className="px-2 py-0.5 rounded-full text-xs font-[var(--font-dm-mono)]"
              style={{ background: activeTabMeta.bg, color: activeTabMeta.color }}>
              {resources.length} file
            </span>
          )}
        </div>

        {/* Resources Grid */}
        {resources && resources.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {resources.map((r) => (
              <a
                key={r.id}
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: "#111111",
                  border: `1px solid ${activeTabMeta.lineColor}`,
                  boxShadow: `0 0 0 0 ${activeTabMeta.color}00`,
                }}
                onMouseEnter={undefined}
              >
                {/* File icon area */}
                <div className="flex items-center justify-center py-7 px-8"
                  style={{ background: activeTabMeta.bg }}>
                  <div className="w-16 h-20 drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <FileIcon ext={activeTabMeta.ext} color={activeTabMeta.color} bg={activeTabMeta.bg} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div>
                    <p className="text-[10px] font-[var(--font-dm-mono)] uppercase tracking-widest mb-1"
                      style={{ color: activeTabMeta.color }}>
                      {activeTabMeta.ext}
                    </p>
                    <h3 className="text-sm font-semibold font-[var(--font-bricolage)] text-white leading-snug line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                  {r.description && (
                    <p className="text-xs text-gray-500 font-[var(--font-bricolage)] leading-relaxed line-clamp-2 flex-1">
                      {r.description}
                    </p>
                  )}
                  <div
                    className="mt-auto text-center py-2 rounded-lg text-xs font-[var(--font-dm-mono)] font-medium transition-all duration-200"
                    style={{
                      background: `${activeTabMeta.color}18`,
                      color: activeTabMeta.color,
                      border: `1px solid ${activeTabMeta.lineColor}`,
                    }}
                  >
                    Buka File ↗
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/8 rounded-2xl py-24 text-center">
            <div className="w-12 h-15 mx-auto mb-4 opacity-20">
              <FileIcon ext={activeTabMeta.ext} color={activeTabMeta.color} bg={activeTabMeta.bg} />
            </div>
            <p className="text-gray-600 font-[var(--font-bricolage)] text-sm">
              Konten untuk kategori ini sedang disiapkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

