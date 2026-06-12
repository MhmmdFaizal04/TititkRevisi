import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("key, value")
    .returns<{ key: string; value: string | null }[]>();

  const settings = Object.fromEntries(
    (rows ?? []).map((r) => [r.key, r.value ?? ""])
  );

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold font-[var(--font-bricolage)] text-[#0a0a0a] mb-6">
        Pengaturan Site
      </h1>
      <SettingsClient settings={settings} />
    </div>
  );
}

