"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createInvoice, updateInvoice, deleteInvoice } from "@/actions/invoices";
import { EmptyState } from "@/components/app/EmptyState";

type Invoice = {
  id: string;
  projectId: string;
  invoiceNumber?: string | null;
  amountCents: number;
  sentDate?: Date | null;
  dueDate?: Date | null;
  paidDate?: Date | null;
  status: "DRAFT" | "SENT" | "OVERDUE" | "PAID";
};

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-800",
  OVERDUE: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
};

const toDateStr = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";
const fmtDate = (d: Date | null | undefined) => d ? new Date(d).toLocaleDateString() : "—";
const fmtMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const emptyForm = (projectId: string) => ({
  projectId,
  invoiceNumber: "",
  amountCents: 0,
  amountDollars: "",
  sentDate: "",
  dueDate: "",
  paidDate: "",
  status: "DRAFT" as const,
});

export function InvoicesTab({ projectId, initialInvoices }: { projectId: string; initialInvoices: Invoice[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm(projectId));
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(projectId));
    setDialogOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({
      projectId,
      invoiceNumber: inv.invoiceNumber ?? "",
      amountCents: inv.amountCents,
      amountDollars: (inv.amountCents / 100).toFixed(2),
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
        setInvoices((prev) => prev.map((i) => (i.id === editing.id ? updated as Invoice : i)));
      } else {
        const created = await createInvoice(payload);
        setInvoices((prev) => [...prev, created as Invoice]);
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

  const total = invoices.filter((i) => i.status !== "DRAFT").reduce((s, i) => s + i.amountCents, 0);
  const paid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amountCents, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Invoices ({invoices.length})</h2>
          {invoices.length > 0 && (
            <p className="text-xs text-gray-500">Total: {fmtMoney(total)} | Paid: {fmtMoney(paid)}</p>
          )}
        </div>
        <Button size="sm" onClick={openCreate}>
          <PlusCircle className="h-4 w-4 mr-1" /> Add Invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Track invoices and payment status for this project."
          action={{ label: "Create Invoice", onClick: openCreate }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
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
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium">{inv.invoiceNumber ?? "—"}</td>
                  <td className="py-2 pr-4">{fmtMoney(inv.amountCents)}</td>
                  <td className="py-2 pr-4 text-gray-600">{fmtDate(inv.sentDate)}</td>
                  <td className="py-2 pr-4 text-gray-600">{fmtDate(inv.dueDate)}</td>
                  <td className="py-2 pr-4 text-gray-600">{fmtDate(inv.paidDate)}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2">
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
            <DialogTitle>{editing ? "Edit Invoice" : "Add Invoice"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Invoice Number</Label>
                <Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} placeholder="INV-001" />
              </div>
              <div>
                <Label>Amount ($)</Label>
                <Input type="number" step="0.01" value={form.amountDollars} onChange={(e) => setForm({ ...form, amountDollars: e.target.value })} placeholder="0.00" />
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
