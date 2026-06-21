"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPronunciation, updatePronunciation, deletePronunciation } from "@/actions/pronunciations";
import { pronunciationsToCsv } from "@/lib/export";
import { EmptyState } from "@/components/app/EmptyState";
import { BookOpen } from "lucide-react";

type PronunciationEntry = {
  id: string;
  term: string;
  phonetic?: string | null;
  category?: string | null;
  source?: string | null;
  notes?: string | null;
  status: "NEEDS_RESEARCH" | "CONFIRMED" | "RECORDED";
};

const STATUS_COLORS = {
  NEEDS_RESEARCH: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  RECORDED: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS = {
  NEEDS_RESEARCH: "Needs Research",
  CONFIRMED: "Confirmed",
  RECORDED: "Recorded",
};

const emptyForm = {
  term: "",
  phonetic: "",
  category: "",
  source: "",
  notes: "",
  status: "NEEDS_RESEARCH" as const,
};

export function PronunciationsTab({ projectId, initialEntries }: { projectId: string; initialEntries: PronunciationEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PronunciationEntry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (entry: PronunciationEntry) => {
    setEditing(entry);
    setForm({
      term: entry.term,
      phonetic: entry.phonetic ?? "",
      category: entry.category ?? "",
      source: entry.source ?? "",
      notes: entry.notes ?? "",
      status: entry.status as typeof form.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        const updated = await updatePronunciation(editing.id, projectId, form);
        setEntries((prev) => prev.map((e) => (e.id === editing.id ? updated as PronunciationEntry : e)));
      } else {
        const created = await createPronunciation(projectId, form);
        setEntries((prev) => [...prev, created as PronunciationEntry]);
      }
      setDialogOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pronunciation entry?")) return;
    await deletePronunciation(id, projectId);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExport = () => {
    const csv = pronunciationsToCsv(entries);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pronunciations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pronunciationsToCsv(filteredEntries));
  };

  const categories = Array.from(
    new Set(entries.map((entry) => entry.category).filter(Boolean) as string[])
  ).sort();

  const filteredEntries = entries.filter((entry) => {
    const haystack = [
      entry.term,
      entry.phonetic,
      entry.category,
      entry.source,
      entry.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || entry.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || entry.category === categoryFilter;
    return matchesQuery && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">Pronunciations ({entries.length})</h2>
        <div className="flex gap-2 flex-wrap justify-end">
          {entries.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" /> Export CSV
              </Button>
            </>
          )}
          <Button size="sm" onClick={openCreate}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-[1fr_180px_180px] mb-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms, sources, notes..."
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "ALL")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="NEEDS_RESEARCH">Needs Research</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="RECORDED">Recorded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? "ALL")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No pronunciation entries yet"
          description="Add terms that need special pronunciation guidance."
          action={{ label: "Add First Entry", onClick: openCreate }}
        />
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No matching pronunciation entries"
          description="Clear the search or filters to see the full pronunciation list."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="pb-2 pr-4">Term</th>
                <th className="pb-2 pr-4">Phonetic</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">Source</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium">{entry.term}</td>
                  <td className="py-2 pr-4 text-gray-600 font-mono text-xs">{entry.phonetic ?? "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{entry.category ?? "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{entry.source ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[entry.status]}`}>
                      {STATUS_LABELS[entry.status]}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(entry)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Entry" : "Add Pronunciation Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Term *</Label>
              <Input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="e.g. Veltharion" />
            </div>
            <div>
              <Label>Phonetic Spelling</Label>
              <Input value={form.phonetic} onChange={(e) => setForm({ ...form, phonetic: e.target.value })} placeholder="e.g. vel-THAR-ee-on" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Character / Place / Term" />
              </div>
              <div>
                <Label>Source</Label>
                <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Author email, glossary..." />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEEDS_RESEARCH">Needs Research</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="RECORDED">Recorded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading || !form.term}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
