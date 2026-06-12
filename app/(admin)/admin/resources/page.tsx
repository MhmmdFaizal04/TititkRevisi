import { createClient } from "@/lib/supabase/server";
import ResourcesClient from "@/components/admin/ResourcesClient";

export default async function AdminResourcesPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("order_index");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-[var(--font-bricolage)] text-[#0a0a0a] mb-6">
        Manajemen Konten
      </h1>
      <ResourcesClient resources={resources ?? []} />
    </div>
  );
}

