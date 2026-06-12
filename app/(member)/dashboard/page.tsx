import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Database } from "@/lib/supabase/types";

type Resource = Database["public"]["Tables"]["resources"]["Row"];
type ResourceType = Resource["type"];

const TABS: { key: ResourceType; label: string }[] = [
  { key: "ebook_prompt", label: "Ebook Prompt AI" },
  { key: "ebook_excel", label: "Template Excel" },
  { key: "ebook_pelajaran", label: "Panduan Skripsi" },
  { key: "template_ppt", label: "Template PPT" },
];

const badgeMap: Record<ResourceType, React.ComponentProps<typeof Badge>["variant"]> = {
  ebook_prompt: "orange",
  ebook_excel: "green",
  ebook_pelajaran: "gray",
  template_ppt: "black",
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab: ResourceType =
    (tab as ResourceType) || "ebook_prompt";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] pb-8 mb-8">
        <p className="text-xs font-[var(--font-dm-mono)] text-[#fb923c] uppercase tracking-widest">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold font-[var(--font-bricolage)] text-white">
          Halo, {profile?.full_name ?? "Mahasiswa"}
        </h1>
        <p className="mt-1 text-gray-400 font-[var(--font-bricolage)]">
          Akses semua konten TitikRevisi di bawah ini.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard?tab=${t.key}`}
            className={`px-5 py-2.5 text-sm font-[var(--font-dm-mono)] transition-all rounded-xl ${
              activeTab === t.key
                ? "bg-[#fb923c] text-white shadow-lg shadow-orange-500/20"
                : "glass text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Resources Grid */}
      {resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-6 flex flex-col hover:border-[#fb923c]/30 transition-all duration-300">
              <Badge variant={badgeMap[r.type]} className="self-start mb-3">
                {TABS.find((t) => t.key === r.type)?.label}
              </Badge>
              <h3 className="text-base font-semibold font-[var(--font-bricolage)] text-white flex-1">
                {r.title}
              </h3>
              {r.description && (
                <p className="mt-2 text-sm text-gray-400 font-[var(--font-bricolage)] leading-relaxed">
                  {r.description}
                </p>
              )}
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-center px-4 py-2.5 bg-[#fb923c] text-white text-sm font-[var(--font-dm-mono)] hover:bg-[#ea580c] transition-all rounded-xl shadow-md shadow-orange-500/15"
              >
                Akses Sekarang
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/10 rounded-2xl py-20 text-center">
          <p className="text-gray-600 font-[var(--font-bricolage)]">
            Konten untuk kategori ini sedang disiapkan.
          </p>
        </div>
      )}
    </div>
  );
}

