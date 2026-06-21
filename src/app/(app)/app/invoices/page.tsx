"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateInvoice, deleteInvoice, getInvoices } from "@/actions/invoices";
import { invoicesToCsv } from "@/lib/export";

type Invoice = {
  id: string;
  projectId: string;
  invoiceNumber?: string | null;
  amountCents: number;
  sentDate?: Date | null;
  dueDate?: Date | null;
  paidDate?: Date | null;
  status: "DRAFT" | "SENT" | "OVERDUE" | "PAID";
  project: { title: string };
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-800",
  OVERDUE: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
};

const toDateStr = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";
const fmtDate = (d: Date | null | undefined) => d ? new Date(d).toLocaleDateString() : "—";
const fmtMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const emptyForm = (projectId = "") => ({
  projectId,
  invoiceNumber: "",
  amountDollars: "",
  amountCents: 0,
  sentDate: "",
  dueDate: "",
  paidDate: "",
  status: "DRAFT" as const,
});

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetching, setFetching] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getInvoices().then((data) => {
      setInvoices(data as Invoice[]);
      setFetching(false);
    });
  }, []);

  const filtered = filter === "ALL" ? invoices : invoices.filter((i) => i.status === filter);

  const total = invoices.reduce((s, i) => s + i.amountCents, 0);
  const paid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amountCents, 0);
  const overdue = invoices.filter((i) => i.status === "OVERDUE").length;

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({
      projectId: inv.projectId,
      invoiceNumber: inv.invoiceNumber ?? "",
      amountDollars: (inv.amountCents / 100).toFixed(2),
      amountCents: inv.amountCents,
      sentDate: toDateStr(inv.sentDate),
      dueDate: toDateStr(inv.dueDate),
      paidDate: toDateStr(inv.paidDate),
      status: inv.status as typeof form.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        amountCents: Math.round(parseFloat(form.amountDollars || "0") * 100),
      };
      if (editing) {
        const updated = await updateInvoice(editing.id, payload);
        setInvoices((prev) => prev.map((i) => (i.id === editing.id ? { ...updated, project: editing.project } as Invoice : i)));
      }
      setDialogOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    await deleteInvoice(id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  const handleExport = () => {
    const csv = invoicesToCsv(invoices);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-500">
            Total: {fmtMoney(total)} · Paid: {fmtMoney(paid)}
            {overdue > 0 && <span className="text-red-600"> · {overdue} overdue</span>}
          </p>
        </div>
        {invoices.length > 0 && (
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {["ALL", "DRAFT", "SENT", "OVERDUE", "PAID"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="py-16 text-center text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-700 mb-2">No invoices found</h3>
          <p className="text-sm text-gray-500">Create invoices from within a project.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="pb-2 pr-4">Project</th>
                <th className="pb-2 pr-4">Invoice #</th>
                <th className="pb-2 pr-4">Amount</th>
                <th className="pb-2 pr-4">Sent</th>
                <th className="pb-2 pr-4">Due</th>
                <th className="pb-2 pr-4">Paid</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((inv) => (
                <tr key={inv.id} className={`hover:bg-gray-50 ${inv.status === "OVERDUE" ? "bg-red-50" : ""}`}>
                  <td className="py-3 pr-4 font-medium text-gray-900">{inv.project.title}</td>
                  <td className="py-3 pr-4 text-gray-600">{inv.invoiceNumber ?? "—"}</td>
                  <td className="py-3 pr-4 font-medium">{fmtMoney(inv.amountCents)}</td>
                  <td className="py-3 pr-4 text-gray-600">{fmtDate(inv.sentDate)}</td>
                  <td className="py-3 pr-4 text-gray-600">{fmtDate(inv.dueDate)}</td>
                  <td className="py-3 pr-4 text-gray-600">{fmtDate(inv.paidDate)}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(inv)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(inv.id)}>
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
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Project: <strong>{editing.project.title}</strong></p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Invoice Number</Label>
                  <Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
                </div>
                <div>
                  <Label>Amount ($)</Label>
                  <Input type="number" step="0.01" value={form.amountDollars} onChange={(e) => setForm({ ...form, amountDollars: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Sent Date</Label>
                  <Input type="date" value={form.sentDate} onChange={(e) => setForm({ ...form, sentDate: e.target.value })} />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div>
                  <Label>Paid Date</Label>
                  <Input type="date" value={form.paidDate} onChange={(e) => setForm({ ...form, paidDate: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
