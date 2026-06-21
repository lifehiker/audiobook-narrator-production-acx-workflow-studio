"use client";

import { useState } from "react";
import { Pencil, Save, X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProject } from "@/actions/projects";

type Project = {
  id: string;
  title: string;
  author?: string | null;
  clientPublisher?: string | null;
  platform: string;
  contractType: string;
  status: string;
  wordCount?: number | null;
  estimatedHours?: number | null;
  dueDate?: Date | null;
  notes?: string | null;
  pfhRate?: number | null;
  royaltyShareType?: string | null;
  contractDate?: Date | null;
  expectedPayment?: number | null;
  paymentDueDate?: Date | null;
  rightsReversionDate?: Date | null;
  royaltyNotes?: string | null;
};

const toDateStr = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";
const fmtDate = (d: Date | null | undefined) => d ? new Date(d).toLocaleDateString() : "—";
const fmtMoney = (v: number | null | undefined) => v != null ? `$${v.toFixed(2)}` : "—";

export function BusinessTab({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: project.title,
    author: project.author ?? "",
    clientPublisher: project.clientPublisher ?? "",
    platform: project.platform,
    contractType: project.contractType,
    status: project.status,
    wordCount: project.wordCount?.toString() ?? "",
    estimatedHours: project.estimatedHours?.toString() ?? "",
    dueDate: toDateStr(project.dueDate),
    notes: project.notes ?? "",
    pfhRate: project.pfhRate?.toString() ?? "",
    royaltyShareType: project.royaltyShareType ?? "",
    contractDate: toDateStr(project.contractDate),
    expectedPayment: project.expectedPayment?.toString() ?? "",
    paymentDueDate: toDateStr(project.paymentDueDate),
    rightsReversionDate: toDateStr(project.rightsReversionDate),
    royaltyNotes: project.royaltyNotes ?? "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProject(project.id, form);
      setEditing(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Business Details</h2>
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Contract Type</CardTitle></CardHeader>
            <CardContent className="text-base font-semibold">{project.contractType}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">PFH Rate</CardTitle></CardHeader>
            <CardContent className="text-base font-semibold flex items-center gap-1">
              <DollarSign className="h-4 w-4" />{project.pfhRate ? `${project.pfhRate}/hr` : "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Expected Payment</CardTitle></CardHeader>
            <CardContent className="text-base font-semibold">{fmtMoney(project.expectedPayment)}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Contract Date</CardTitle></CardHeader>
            <CardContent className="text-base font-semibold">{fmtDate(project.contractDate)}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Payment Due</CardTitle></CardHeader>
            <CardContent className="text-base font-semibold">{fmtDate(project.paymentDueDate)}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Rights Reversion Date</CardTitle></CardHeader>
            <CardContent className="text-base font-semibold">{fmtDate(project.rightsReversionDate)}</CardContent>
          </Card>
          {project.royaltyShareType && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Royalty Share Type</CardTitle></CardHeader>
              <CardContent className="text-base">{project.royaltyShareType}</CardContent>
            </Card>
          )}
          {project.royaltyNotes && (
            <Card className="sm:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Royalty Notes</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-700">{project.royaltyNotes}</CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Edit Business Details</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-1" /> {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Contract Type</Label>
            <Select value={form.contractType} onValueChange={(value) => setForm({ ...form, contractType: value ?? "PFH" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PFH">Per Finished Hour (PFH)</SelectItem>
                <SelectItem value="ROYALTY_SHARE">Royalty Share</SelectItem>
                <SelectItem value="ROYALTY_SHARE_PLUS">Royalty Share Plus</SelectItem>
                <SelectItem value="FLAT_FEE">Flat Fee</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>PFH Rate ($/hr)</Label>
            <Input type="number" step="0.01" value={form.pfhRate} onChange={(e) => setForm({ ...form, pfhRate: e.target.value })} placeholder="225.00" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Expected Payment ($)</Label>
            <Input type="number" step="0.01" value={form.expectedPayment} onChange={(e) => setForm({ ...form, expectedPayment: e.target.value })} />
          </div>
          <div>
            <Label>Royalty Share Type</Label>
            <Input value={form.royaltyShareType} onChange={(e) => setForm({ ...form, royaltyShareType: e.target.value })} placeholder="e.g. 20% royalty" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Contract Date</Label>
            <Input type="date" value={form.contractDate} onChange={(e) => setForm({ ...form, contractDate: e.target.value })} />
          </div>
          <div>
            <Label>Payment Due</Label>
            <Input type="date" value={form.paymentDueDate} onChange={(e) => setForm({ ...form, paymentDueDate: e.target.value })} />
          </div>
          <div>
            <Label>Rights Reversion Date</Label>
            <Input type="date" value={form.rightsReversionDate} onChange={(e) => setForm({ ...form, rightsReversionDate: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Royalty Notes</Label>
          <Textarea value={form.royaltyNotes} onChange={(e) => setForm({ ...form, royaltyNotes: e.target.value })} rows={3} />
        </div>
      </div>
    </div>
  );
}
