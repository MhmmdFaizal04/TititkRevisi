import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function Pricing() {
  return (
    <section
      id="harga"
      className="py-24 px-6 bg-[#0a0a0a] border-b border-white/10"
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs font-[var(--font-dm-mono)] uppercase tracking-widest text-[#fb923c]">
          Harga
        </span>
        <h2 className="mt-3 text-4xl md:text-5xl font-[var(--font-bricolage)] font-bold text-white leading-tight">
          Satu harga, akses selamanya.
        </h2>
        <p className="mt-4 text-gray-400 font-[var(--font-bricolage)] text-lg">
          Tidak ada biaya langganan, tidak ada biaya tambahan. Bayar sekali,
          nikmati semua konten seumur hidup.
        </p>

        <div className="mt-12 glass-strong rounded-3xl p-10 text-left shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-semibold font-[var(--font-bricolage)] text-white">
                Akses Lengkap TitikRevisi
              </h3>
              <p className="mt-1 text-gray-400 text-sm font-[var(--font-bricolage)]">
                Semua ebook, template, dan update konten ke depannya.
              </p>
            </div>
            <Badge variant="orange">PROMO</Badge>
          </div>

          <div className="mt-8 flex items-end gap-4">
            <span className="text-5xl font-extrabold font-[var(--font-bricolage)] text-[#fb923c]">
              Rp 69.000
            </span>
            <span className="text-2xl font-[var(--font-bricolage)] text-gray-500 price-original mb-1">
              Rp 250.000
            </span>
          </div>

          <p className="mt-2 text-sm text-[#fb923c] font-[var(--font-dm-mono)]">
            Hemat Rp 181.000 — Harga promo terbatas
          </p>

          <hr className="my-8 border-white/10" />

          <ul className="space-y-3 text-gray-300 font-[var(--font-bricolage)] text-sm">
            {[
              "Ebook Prompt AI untuk seluruh bab skripsi",
              "Template Excel analisis data (uji validitas, reliabilitas, regresi)",
              "Ebook panduan skripsi langkah demi langkah",
              "Template PPT ujian tutup dan presentasi hasil",
              "Akses selamanya — termasuk update konten",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-[#fb923c]/15 border border-[#fb923c]/30 inline-flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link
              href="/register"
              className="inline-block w-full text-center px-8 py-4 bg-[#fb923c] text-white font-semibold font-[var(--font-dm-mono)] hover:bg-[#ea580c] transition-all text-base rounded-xl shadow-lg shadow-orange-500/25"
            >
              Daftar Sekarang — Rp 69.000
            </Link>
            <p className="mt-3 text-center text-xs text-gray-500 font-[var(--font-dm-mono)]">
              Pembayaran via QRIS. Akses aktif setelah konfirmasi admin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

