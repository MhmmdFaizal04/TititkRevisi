"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: "01",
    title: "Ebook Prompt AI Skripsi",
    description:
      "Ratusan prompt siap pakai untuk ChatGPT dan AI lainnya. Dari latar belakang, tinjauan pustaka, hingga pembahasan hasil penelitian.",
  },
  {
    id: "02",
    title: "Template Excel Analisis Data",
    description:
      "Template Excel terstruktur untuk uji validitas, reliabilitas, regresi, dan analisis deskriptif. Tinggal input data.",
  },
  {
    id: "03",
    title: "Panduan Belajar Skripsi",
    description:
      "Ebook step-by-step dari proposal hingga sidang. Bahasa mudah dipahami, contoh nyata dari berbagai jurusan.",
  },
  {
    id: "04",
    title: "Template PPT Ujian Tutup",
    description:
      "Template presentasi profesional untuk sidang skripsi. Desain bersih, layout sudah terstruktur, tinggal ganti konten.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Total horizontal distance to scroll
      const getScrollDist = () => track.scrollWidth - window.innerWidth;

      // Pin the section and scrub the horizontal track
      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollDist()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="fitur"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* Horizontal track — (features + 1 intro panel) × 100vw */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${(features.length + 1) * 100}vw` }}
      >
        {/* Panel 0 — Intro heading */}
        <div className="w-screen h-full flex-shrink-0 flex flex-col justify-center px-12 md:px-24 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#fb923c]/8 blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-[var(--font-dm-mono)] uppercase tracking-widest text-[#fb923c]">
              Yang kamu dapatkan
            </span>
            <h2 className="mt-4 text-5xl md:text-7xl font-[var(--font-bricolage)] font-bold text-white leading-tight">
              Semua yang
              <br />
              kamu butuhkan
              <br />
              <span className="text-[#fb923c]">untuk lulus.</span>
            </h2>
            <p className="mt-6 text-gray-400 font-[var(--font-bricolage)] text-lg leading-relaxed max-w-md">
              Scroll untuk melihat semua yang ada di dalam TitikRevisi.
            </p>
            {/* Animated scroll hint */}
            <div className="mt-10 flex items-center gap-3 text-gray-600 font-[var(--font-dm-mono)] text-xs uppercase tracking-widest">
              <span>Scroll</span>
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature panels */}
        {features.map((f, i) => (
          <div
            key={f.id}
            className="w-screen h-full flex-shrink-0 flex items-center justify-center px-12 md:px-24"
          >
            <div className="glass-strong rounded-3xl p-12 max-w-xl w-full relative overflow-hidden">
              {/* Card ambient glow */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#fb923c]/10 blur-[60px] pointer-events-none" />

              <span className="font-[var(--font-dm-mono)] text-7xl font-bold text-[#fb923c]/15 select-none block mb-4 leading-none">
                {f.id}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-[var(--font-bricolage)] text-white leading-snug">
                {f.title}
              </h3>
              <p className="mt-4 text-gray-400 font-[var(--font-bricolage)] text-lg leading-relaxed">
                {f.description}
              </p>

              {/* Progress indicator */}
              <div className="mt-10 flex gap-2 items-center">
                {features.map((_, di) => (
                  <span
                    key={di}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      di === i ? "w-8 bg-[#fb923c]" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

