import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("payment_status")
    .eq("id", user.id)
    .returns<{ payment_status: string | null }[]>()
    .single();

  if (!profile || profile.payment_status !== "confirmed") {
    redirect("/payment");
  }

  const { data: waSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "whatsapp_number")
    .single();

  const waNumber = waSetting?.value ?? "6281234567890";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-14">{children}</main>
      <WhatsAppButton phoneNumber={waNumber} />
    </>
  );
}

