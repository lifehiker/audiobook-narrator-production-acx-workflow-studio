"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Download, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPickup, updatePickup, deletePickup } from "@/actions/pickups";
import { pickupsToCsv } from "@/lib/export";
import { EmptyState } from "@/components/app/EmptyState";

type PickupNote = {
  id: string;
  chapter?: string | null;
  location?: string | null;
  issueType: "MISREAD" | "PRONUNCIATION" | "NOISE" | "PACING" | "MISSING_LINE" | "OTHER";
  originalText?: string | null;
  correctedText?: string | null;
  notes?: string | null;
  status: "OPEN" | "RECORDED" | "SENT" | "APPROVED";
};

const STATUS_COLORS = {
  OPEN: "bg-red-100 text-red-800",
  RECORDED: "bg-blue-100 text-blue-800",
  SENT: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
};

const ISSUE_LABELS: Record<string, string> = {
  MISREAD: "Misread",
  PRONUNCIATION: "Pronunciation",
  NOISE: "Noise",
  PACING: "Pacing",
  MISSING_LINE: "Missing Line",
  OTHER: "Other",
};

const emptyForm = {
  chapter: "",
  location: "",
  issueType: "MISREAD" as const,
  originalText: "",
  correctedText: "",
  notes: "",
  status: "OPEN" as const,
};

export function PickupsTab({ projectId, initialPickups }: { projectId: string; initialPickups: PickupNote[] }) {
  const [pickups, setPickups] = useState(initialPickups);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PickupNote | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (pickup: PickupNote) => {
    setEditing(pickup);
    setForm({
      chapter: pickup.chapter ?? "",
      location: pickup.location ?? "",
      issueType: pickup.issueType as typeof form.issueType,
      originalText: pickup.originalText ?? "",
      correctedText: pickup.correctedText ?? "",
      notes: pickup.notes ?? "",
      status: pickup.status as typeof form.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        const updated = await updatePickup(editing.id, projectId, form);
        setPickups((prev) => prev.map((p) => (p.id === editing.id ? updated as PickupNote : p)));
      } else {
        const created = await createPickup(projectId, form);
        setPickups((prev) => [...prev, created as PickupNote]);
      }
      setDialogOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pickup?")) return;
    await deletePickup(id, projectId);
    setPickups((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExport = () => {
    const csv = pickupsToCsv(pickups);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pickups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pickupsToCsv(filtered));
  };

  const filtered = filter === "ALL" ? pickups : pickups.filter((p) => p.status === filter);
  const openCount = pickups.filter((p) => p.status === "OPEN").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Pickups ({pickups.length})</h2>
          {openCount > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
              {openCount} open
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v ?? "ALL")}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="RECORDED">Recorded</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
            </SelectContent>
          </Select>
          {pickups.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </>
          )}
          <Button size="sm" onClick={openCreate}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Pickup
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title={filter === "ALL" ? "No pickups yet" : `No ${filter.toLowerCase()} pickups`}
          description="Track re-records, noise issues, and other corrections needed."
          action={filter === "ALL" ? { label: "Add First Pickup", onClick: openCreate } : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((pickup) => (
            <div key={pickup.id} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {pickup.chapter && (
                      <span className="text-xs font-medium text-gray-500">Ch. {pickup.chapter}</span>
                    )}
                    {pickup.location && (
                      <span className="text-xs text-gray-400 font-mono">{pickup.location}</span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {ISSUE_LABELS[pickup.issueType]}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_COLORS[pickup.status]}`}>
                      {pickup.status}
                    </span>
                  </div>
                  {pickup.originalText && (
                    <p className="text-sm text-gray-700 line-through text-xs">{pickup.originalText}</p>
                  )}
                  {pickup.correctedText && (
                    <p className="text-sm font-medium text-gray-900">{pickup.correctedText}</p>
                  )}
                  {pickup.notes && (
                    <p className="text-xs text-gray-500 mt-1">{pickup.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(pickup)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(pickup.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Pickup" : "Add Pickup"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Chapter</Label>
                <Input value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} placeholder="3" />
              </div>
              <div>
                <Label>Timecode / Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="00:12:34" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Issue Type</Label>
                <Select value={form.issueType} onValueChange={(v) => setForm({ ...form, issueType: v as typeof form.issueType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MISREAD">Misread</SelectItem>
                    <SelectItem value="PRONUNCIATION">Pronunciation</SelectItem>
                    <SelectItem value="NOISE">Noise</SelectItem>
                    <SelectItem value="PACING">Pacing</SelectItem>
                    <SelectItem value="MISSING_LINE">Missing Line</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="RECORDED">Recorded</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Original Text</Label>
              <Textarea value={form.originalText} onChange={(e) => setForm({ ...form, originalText: e.target.value })} placeholder="What was said incorrectly..." rows={2} />
            </div>
            <div>
              <Label>Corrected Text / Action</Label>
              <Textarea value={form.correctedText} onChange={(e) => setForm({ ...form, correctedText: e.target.value })} placeholder="What needs to be recorded..." rows={2} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
