import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user_id)
      .single();

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://titikrevisi.vercel.app";

    // Send via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "TitikRevisi <noreply@titikrevisi.com>",
        to: [profile.email],
        subject: "Akses TitikRevisi sudah aktif!",
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
            <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">TitikRevisi</h1>
            <hr style="border: 1px solid #0a0a0a; margin-bottom: 32px;" />
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">
              Selamat bergabung, ${profile.full_name ?? "Mahasiswa"}!
            </h2>
            <p style="line-height: 1.7; color: #374151; margin-bottom: 16px;">
              Pembayaranmu sudah kami konfirmasi. Akses ke semua konten TitikRevisi kini sudah aktif.
            </p>
            <p style="line-height: 1.7; color: #374151; margin-bottom: 24px;">
              Masuk ke dashboard sekarang dan mulai gunakan ebook prompt AI, template Excel, panduan skripsi, dan template PPT ujian tutupmu.
            </p>
            <a
              href="${siteUrl}/dashboard"
              style="
                display: inline-block;
                background-color: #fb923c;
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                font-weight: 600;
                font-family: monospace;
                letter-spacing: 0.05em;
              "
            >
              Masuk ke Dashboard
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #9ca3af; font-family: monospace;">
              TitikRevisi &bull; Bayar sekali, akses selamanya
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

