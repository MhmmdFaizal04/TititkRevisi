"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          ".hero-headline",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          "-=0.3"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          ".hero-mono",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.2"
        );

      // Animate SVG underline on "Skripsimu"
      const path = underlineRef.current;
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power3.inOut",
          delay: 0.8,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center pt-14 bg-[#0a0a0a] border-b border-white/5 px-6 relative overflow-hidden"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#fb923c]/8 blur-[120px]" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="hero-badge inline-flex items-center gap-2 glass-orange px-4 py-1.5 mb-8 rounded-full">
          <span className="text-xs font-medium font-[var(--font-dm-mono)] uppercase tracking-widest text-[#fb923c]">
            Khusus Mahasiswa Akhir
          </span>
        </div>

        <h1 className="font-[var(--font-bricolage)] font-extrabold leading-normal">
          <span className="hero-headline block text-5xl md:text-7xl text-white">
            Selesaikan
          </span>
          <span className="hero-headline block text-5xl md:text-7xl text-[#fb923c] relative inline-block" style={{ fontFamily: "'Permian Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>
            Skripsimu
            {/* Animated SVG underline */}
            <svg
              viewBox="0 0 460 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-2 left-0 w-full"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M 4 10 Q 80 2 160 10 Q 240 18 320 10 Q 400 2 456 10"
                stroke="#fb923c"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0"
              />
            </svg>
          </span>
          <span className="hero-headline block text-5xl md:text-7xl text-white">
            Lebih Cepat.
          </span>
        </h1>

        <p className="hero-sub mt-8 text-lg md:text-xl text-gray-400 font-[var(--font-bricolage)] max-w-2xl mx-auto leading-relaxed">
          Ebook prompt AI, template Excel analisis data, panduan bab per bab,
          dan template PPT ujian tutup — semua dalam satu akses seumur hidup.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="hero-cta px-8 py-4 bg-[#fb923c] text-white font-medium font-[var(--font-dm-mono)] hover:bg-[#ea580c] transition-all text-base rounded-xl shadow-lg shadow-orange-500/20"
          >
            Mulai Sekarang — Rp 69.000
          </Link>
          <Link
            href="/#fitur"
            className="hero-cta px-8 py-4 glass border border-white/10 text-gray-300 font-medium font-[var(--font-dm-mono)] hover:border-[#fb923c]/50 hover:text-[#fb923c] transition-all text-base rounded-xl"
          >
            Lihat Fitur
          </Link>
        </div>

        <p className="hero-mono mt-8 text-xs text-gray-600 font-[var(--font-dm-mono)] tracking-wide">
          BAYAR SEKALI &nbsp;&bull;&nbsp; AKSES SELAMANYA &nbsp;&bull;&nbsp; TANPA BIAYA LANGGANAN
        </p>
      </div>
    </section>
  );
}

