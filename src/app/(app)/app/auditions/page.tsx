"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Download, Mic2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAudition, updateAudition, deleteAudition, getAuditions } from "@/actions/auditions";
import { auditionsToCsv } from "@/lib/export";

type Audition = {
  id: string;
  title: string;
  author?: string | null;
  client?: string | null;
  platform: string;
  auditionDate?: Date | null;
  submittedDate?: Date | null;
  rateTerms?: string | null;
  status: "SAVED" | "SUBMITTED" | "SHORTLISTED" | "WON" | "LOST" | "NO_RESPONSE";
  notes?: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-800",
  SHORTLISTED: "bg-purple-100 text-purple-800",
  WON: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
  NO_RESPONSE: "bg-yellow-100 text-yellow-800",
};

const toDateStr = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";
const fmtDate = (d: Date | null | undefined) => d ? new Date(d).toLocaleDateString() : "—";

const emptyForm = {
  title: "",
  author: "",
  client: "",
  platform: "ACX",
  auditionDate: "",
  submittedDate: "",
  rateTerms: "",
  status: "SAVED" as const,
  notes: "",
};

const FILTERS = ["ALL", "SAVED", "SUBMITTED", "SHORTLISTED", "WON", "LOST", "NO_RESPONSE"];

export default function AuditionsPage() {
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Audition | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAuditions().then((data) => {
      setAuditions(data as Audition[]);
      setFetching(false);
    });
  }, []);

  const filtered = filter === "ALL" ? auditions : auditions.filter((a) => a.status === filter);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: Audition) => {
    setEditing(a);
    setForm({
      title: a.title,
      author: a.author ?? "",
      client: a.client ?? "",
      platform: a.platform,
      auditionDate: toDateStr(a.auditionDate),
      submittedDate: toDateStr(a.submittedDate),
      rateTerms: a.rateTerms ?? "",
      status: a.status as typeof form.status,
      notes: a.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        const updated = await updateAudition(editing.id, form);
        setAuditions((prev) => prev.map((a) => (a.id === editing.id ? updated as Audition : a)));
      } else {
        const created = await createAudition(form);
        setAuditions((prev) => [created as Audition, ...prev]);
      }
      setDialogOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this audition?")) return;
    await deleteAudition(id);
    setAuditions((prev) => prev.filter((a) => a.id !== id));
  };

  const handleExport = () => {
    const csv = auditionsToCsv(auditions);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auditions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(auditionsToCsv(filtered));
  };

  const wonCount = auditions.filter((a) => a.status === "WON").length;
  const submittedCount = auditions.filter((a) => a.status === "SUBMITTED" || a.status === "SHORTLISTED").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auditions</h1>
          <p className="text-sm text-gray-500">{auditions.length} total · {wonCount} won · {submittedCount} in pipeline</p>
        </div>
        <div className="flex gap-2">
          {auditions.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" /> Export CSV
              </Button>
            </>
          )}
          <Button onClick={openCreate}>
            <PlusCircle className="h-4 w-4 mr-1" /> Log Audition
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase().replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="py-16 text-center text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Mic2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-700 mb-2">No auditions found</h3>
          <p className="text-sm text-gray-500 mb-4">Track your audition pipeline and win rates.</p>
          <Button onClick={openCreate}><PlusCircle className="h-4 w-4 mr-1" /> Log Audition</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="pb-2 pr-4">Title / Author</th>
                <th className="pb-2 pr-4">Client</th>
                <th className="pb-2 pr-4">Platform</th>
                <th className="pb-2 pr-4">Audition Date</th>
                <th className="pb-2 pr-4">Rate/Terms</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{a.title}</div>
                    {a.author && <div className="text-xs text-gray-500">by {a.author}</div>}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{a.client ?? "—"}</td>
                  <td className="py-3 pr-4 text-gray-600">{a.platform}</td>
                  <td className="py-3 pr-4 text-gray-600">{fmtDate(a.auditionDate)}</td>
                  <td className="py-3 pr-4 text-gray-600 text-xs">{a.rateTerms ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                      {a.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(a.id)}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Audition" : "Log Audition"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Book Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Author</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <Label>Client</Label>
                <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v ?? "ACX" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACX">ACX</SelectItem>
                    <SelectItem value="FINDAWAY">Findaway</SelectItem>
                    <SelectItem value="DIRECT">Direct</SelectItem>
                    <SelectItem value="PUBLISHER">Publisher</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAVED">Saved</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                    <SelectItem value="WON">Won</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                    <SelectItem value="NO_RESPONSE">No Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Audition Date</Label>
                <Input type="date" value={form.auditionDate} onChange={(e) => setForm({ ...form, auditionDate: e.target.value })} />
              </div>
              <div>
                <Label>Submitted Date</Label>
                <Input type="date" value={form.submittedDate} onChange={(e) => setForm({ ...form, submittedDate: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Rate / Terms</Label>
              <Input value={form.rateTerms} onChange={(e) => setForm({ ...form, rateTerms: e.target.value })} placeholder="e.g. PFH $200, Royalty Share..." />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading || !form.title}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
