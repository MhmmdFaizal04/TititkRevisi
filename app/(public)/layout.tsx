import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: waSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "whatsapp_number")
    .single();

  const waNumber = waSetting?.value ?? "6281234567890";

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton phoneNumber={waNumber} />
    </>
  );
}

