"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/admin/payments", label: "Pembayaran", icon: "₿" },
  { href: "/admin/resources", label: "Konten", icon: "▤" },
  { href: "/admin/settings", label: "Pengaturan", icon: "⚙" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="font-[var(--font-bricolage)] font-bold text-base text-white">
            TitikRevisi
          </span>
          <span className="block text-xs text-gray-500 font-[var(--font-dm-mono)] mt-0.5">
            Admin Panel
          </span>
        </div>
        {/* Close button (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-gray-400 hover:text-white text-xl leading-none"
        >
          ✕
        </button>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-[var(--font-dm-mono)] transition-colors ${
                active
                  ? "text-white bg-white/8 border-r-2 border-[#fb923c]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base w-4 text-center opacity-60">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <AdminLogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-40">
        <div>
          <span className="font-[var(--font-bricolage)] font-bold text-white">TitikRevisi</span>
          <span className="ml-2 text-xs text-gray-500 font-[var(--font-dm-mono)]">Admin</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-400 hover:text-white p-2"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-[#0a0a0a] border-r border-white/10 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
