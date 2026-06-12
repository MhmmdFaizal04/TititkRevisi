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
    const { user_id, full_name, email } = await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://titik-revisi.vercel.app";

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "TitikRevisi <onboarding@resend.dev>",
        to: [email],
        subject: "Selamat datang di TitikRevisi!",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid #2a2a2a;">
            <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">TitikRevisi</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 12px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">
              Halo, ${full_name ?? "Mahasiswa"}!
            </h2>
            <p style="margin:0 0 16px;color:#9ca3af;font-size:15px;line-height:1.7;">
              Akun TitikRevisi kamu berhasil dibuat. Satu langkah lagi untuk mengakses semua konten yang kamu butuhkan untuk menyelesaikan skripsi.
            </p>
            <p style="margin:0 0 32px;color:#9ca3af;font-size:15px;line-height:1.7;">
              Selesaikan pembayaran <strong style="color:#fb923c;">Rp 69.000</strong> untuk mendapatkan akses seumur hidup ke:
            </p>

            <!-- Feature list -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                "500+ Prompt AI untuk skripsi",
                "Template Excel analisis data",
                "Panduan skripsi bab per bab",
                "Template PPT ujian tutup",
              ].map(f => `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #1f1f1f;">
                  <span style="color:#fb923c;margin-right:10px;">✦</span>
                  <span style="color:#d1d5db;font-size:14px;">${f}</span>
                </td>
              </tr>`).join("")}
            </table>

            <!-- CTA -->
            <a href="${siteUrl}/payment"
               style="display:inline-block;background:#fb923c;color:#ffffff;padding:14px 32px;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;letter-spacing:0.03em;">
              Selesaikan Pembayaran
            </a>

            <p style="margin:32px 0 0;font-size:12px;color:#4b5563;line-height:1.6;">
              Jika kamu tidak mendaftar di TitikRevisi, abaikan email ini.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2a2a2a;background:#0d0d0d;">
            <p style="margin:0;font-size:11px;color:#374151;font-family:monospace;letter-spacing:0.05em;">
              TITIKREVISI &bull; BAYAR SEKALI &bull; AKSES SELAMANYA
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
        `,
      }),
    });

    const result = await emailRes.json();

    if (!emailRes.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
