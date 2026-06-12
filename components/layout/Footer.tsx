import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#060606] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-[var(--font-bricolage)] font-bold text-lg mb-3">
            TitikRevisi
          </h3>
          <p className="text-sm text-gray-400 font-[var(--font-bricolage)] leading-relaxed">
            Platform lengkap untuk mahasiswa akhir. Satu bayar, akses
            selamanya.
          </p>
        </div>
        <div>
          <h4 className="font-[var(--font-dm-mono)] text-xs uppercase tracking-widest text-gray-500 mb-3">
            Navigasi
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/#fitur" className="hover:text-[#fb923c] transition-colors">
                Fitur
              </Link>
            </li>
            <li>
              <Link href="/#harga" className="hover:text-[#fb923c] transition-colors">
                Harga
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#fb923c] transition-colors">
                Daftar
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#fb923c] transition-colors">
                Masuk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-[var(--font-dm-mono)] text-xs uppercase tracking-widest text-gray-500 mb-3">
            Kontak
          </h4>
          <p className="text-sm text-gray-400">
            Ada pertanyaan? Hubungi kami via WhatsApp CS yang tersedia di halaman ini.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-600 font-[var(--font-dm-mono)]">
        &copy; {new Date().getFullYear()} TitikRevisi. All rights reserved.
      </div>
    </footer>
  );
}

