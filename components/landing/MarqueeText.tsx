"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const items = [
  { text: "Skripsi Lebih Cepat", font: "var(--font-bricolage)", style: "normal" },
  { text: "AI Prompt Ready", font: "var(--font-dm-mono)", style: "normal" },
  { text: "Lulus Tepat Waktu", font: "Permian Serif", style: "italic" },
  { text: "Template Excel", font: "var(--font-bricolage)", style: "normal" },
  { text: "Bayar Sekali Seumur Hidup", font: "var(--font-dm-mono)", style: "normal" },
  { text: "Panduan Bab per Bab", font: "Permian Serif", style: "italic" },
  { text: "Template PPT Sidang", font: "var(--font-bricolage)", style: "normal" },
  { text: "1.200+ Mahasiswa", font: "var(--font-dm-mono)", style: "normal" },
  { text: "Akses Selamanya", font: "Permian Serif", style: "italic" },
];

// Duplicate for seamless loop
const doubled = [...items, ...items];

const dot = (
  <span className="mx-6 text-[#fb923c] text-lg select-none" aria-hidden>
    ✦
  </span>
);

export default function MarqueeText() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const duration = 32;

    // Row 1 — left to right
    gsap.to(track1Ref.current, {
      xPercent: -50,
      duration,
      ease: "none",
      repeat: -1,
    });

    // Row 2 — right to left (opposite direction)
    gsap.fromTo(
      track2Ref.current,
      { xPercent: -50 },
      {
        xPercent: 0,
        duration,
        ease: "none",
        repeat: -1,
      }
    );
  });

  return (
    <div className="w-full overflow-hidden py-6 border-y border-white/5 bg-[#0a0a0a] select-none">
      {/* Row 1 — moves left */}
      <div className="flex whitespace-nowrap mb-4">
        <div ref={track1Ref} className="flex whitespace-nowrap" style={{ width: "max-content" }}>
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="text-sm md:text-base text-white/70 hover:text-white transition-colors duration-200"
                style={{
                  fontFamily: item.font,
                  fontStyle: item.style,
                  fontWeight: item.font === "var(--font-bricolage)" ? 600 : item.font === "Permian Serif" ? 400 : 400,
                  letterSpacing: item.font === "var(--font-dm-mono)" ? "0.05em" : "0",
                }}
              >
                {item.text}
              </span>
              {dot}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — moves right */}
      <div className="flex whitespace-nowrap">
        <div ref={track2Ref} className="flex whitespace-nowrap" style={{ width: "max-content" }}>
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="text-sm md:text-base text-white/40 hover:text-[#fb923c] transition-colors duration-200"
                style={{
                  fontFamily: item.font,
                  fontStyle: item.style,
                  fontWeight: item.font === "var(--font-bricolage)" ? 600 : 400,
                  letterSpacing: item.font === "var(--font-dm-mono)" ? "0.05em" : "0",
                }}
              >
                {item.text}
              </span>
              {dot}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
