import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavbarClient from "@/components/layout/NavbarClient";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let paymentStatus: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("payment_status")
      .eq("id", user.id)
      .returns<{ payment_status: string | null }[]>()
      .single();
    paymentStatus = profile?.payment_status ?? null;
  }

  return <NavbarClient isLoggedIn={!!user} paymentStatus={paymentStatus} />;
}

