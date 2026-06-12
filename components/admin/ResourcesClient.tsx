"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

type Resource = Database["public"]["Tables"]["resources"]["Row"];
type ResourceType = Resource["type"];

const TYPES: { key: ResourceType; label: string }[] = [
  { key: "ebook_prompt", label: "Ebook Prompt AI" },
  { key: "ebook_excel", label: "Template Excel" },
  { key: "ebook_pelajaran", label: "Panduan Skripsi" },
  { key: "template_ppt", label: "Template PPT" },
];

const emptyForm = {
  title: "",
  description: "",
  type: "ebook_prompt" as ResourceType,
  link: "",
  order_index: 0,
  is_active: true,
};

export default function ResourcesClient({ resources }: { resources: Resource[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(r: Resource) {
    setEditing(r);
    setForm({
      title: r.title,
      description: r.description ?? "",
      type: r.type,
      link: r.link,
      order_index: r.order_index,
      is_active: r.is_active,
    });
    setOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    const supabase = createClient();

    if (editing) {
      await supabase.from("resources").update(form).eq("id", editing.id);
    } else {
      await supabase.from("resources").insert(form);
    }

    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus konten ini?")) return;
    const supabase = createClient();
    await supabase.from("resources").delete().eq("id", id);
    router.refresh();
  }

  async function toggleActive(r: Resource) {
    const supabase = createClient();
    await supabase
      .from("resources")
      .update({ is_active: !r.is_active })
      .eq("id", r.id);
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} size="sm">
          Tambah Konten
        </Button>
      </div>

      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm font-[var(--font-bricolage)]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {["Judul", "Tipe", "Urutan", "Status", "Aksi"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-[var(--font-dm-mono)] uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white max-w-xs truncate">{r.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="gray" className="text-xs">
                    {TYPES.find((t) => t.key === r.type)?.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-[var(--font-dm-mono)] text-xs text-gray-500">
                  {r.order_index}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(r)}>
                    <Badge variant={r.is_active ? "green" : "gray"}>
                      {r.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(r)}
                      className="text-xs font-[var(--font-dm-mono)] text-[#0a0a0a] hover:text-[#fb923c] underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-xs font-[var(--font-dm-mono)] text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-600">
                  Belum ada konten.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Konten" : "Tambah Konten"}
      >
        <div className="space-y-4">
          <Input
            label="Judul"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Judul konten"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium font-[var(--font-dm-mono)]">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#fb923c] resize-none text-sm"
              placeholder="Deskripsi singkat (opsional)"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium font-[var(--font-dm-mono)]">
              Tipe
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ResourceType }))}
              className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#fb923c] text-sm"
            >
              {TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Link"
            type="url"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            placeholder="https://drive.google.com/..."
          />
          <Input
            label="Urutan Tampil"
            type="number"
            value={form.order_index}
            onChange={(e) =>
              setForm((f) => ({ ...f, order_index: parseInt(e.target.value) || 0 }))
            }
          />
          <label className="flex items-center gap-2 text-sm font-[var(--font-dm-mono)] cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-[#fb923c]"
            />
            Aktif (tampil ke member)
          </label>
          <Button onClick={handleSave} loading={loading} className="w-full">
            {editing ? "Simpan Perubahan" : "Tambah Konten"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

