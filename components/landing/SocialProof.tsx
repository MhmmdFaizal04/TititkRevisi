"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const avatars = [
  { initials: "AR", color: "#fb923c" },
  { initials: "DW", color: "#6366f1" },
  { initials: "NS", color: "#10b981" },
  { initials: "BF", color: "#f43f5e" },
  { initials: "YP", color: "#8b5cf6" },
  { initials: "MR", color: "#0ea5e9" },
];

const stats = [
  { value: "1.200+", label: "Mahasiswa bergabung" },
  { value: "4.9", label: "Rating rata-rata" },
  { value: "89%", label: "Lulus tepat waktu" },
];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sp-avatar",
        { opacity: 0, y: 16, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
      gsap.fromTo(
        ".sp-stat",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
      gsap.fromTo(
        ".sp-text",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 bg-[#0a0a0a] border-b border-white/5"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
        {/* Avatar stack + label */}
        <div className="sp-text flex flex-col items-center gap-4">
          <div className="flex items-center">
            {avatars.map((a, i) => (
              <div
                key={i}
                className="sp-avatar w-10 h-10 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-xs font-bold text-white font-[var(--font-dm-mono)] -ml-3 first:ml-0"
                style={{ backgroundColor: a.color, zIndex: avatars.length - i }}
              >
                {a.initials}
              </div>
            ))}
            {/* +count bubble */}
            <div className="sp-avatar w-10 h-10 rounded-full border-2 border-[#0a0a0a] glass-strong flex items-center justify-center text-xs font-bold text-white font-[var(--font-dm-mono)] -ml-3">
              +1K
            </div>
          </div>
          <p className="text-gray-400 font-[var(--font-bricolage)] text-base">
            Bergabung bersama{" "}
            <span className="text-white font-semibold">1.200+ mahasiswa</span>{" "}
            yang sudah menyelesaikan skripsinya.
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {stats.map((s, i) => (
            <div
              key={i}
              className="sp-stat glass rounded-2xl px-6 py-6 flex flex-col items-center gap-1"
            >
              <span className="text-3xl md:text-4xl font-bold font-[var(--font-bricolage)] text-white">
                {s.value}
              </span>
              <span className="text-xs text-gray-500 font-[var(--font-dm-mono)] uppercase tracking-widest text-center">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Star rating */}
        <div className="sp-text flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-[#fb923c]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-sm font-[var(--font-dm-mono)]">
            4.9 dari 5 &mdash; berdasarkan ulasan pengguna
          </span>
        </div>
      </div>
    </section>
  );
}
