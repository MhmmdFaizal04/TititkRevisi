import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page renders without sidebar
  if (!user) {
    return <>{children}</>;
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Non-admin user — render without sidebar (middleware will redirect them)
  if (!adminProfile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="md:ml-56 min-h-screen">{children}</main>
    </div>
  );
}

