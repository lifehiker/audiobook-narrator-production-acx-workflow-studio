"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProject } from "@/actions/projects";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    clientPublisher: "",
    platform: "ACX",
    contractType: "PFH",
    status: "AUDITIONING",
    wordCount: "",
    estimatedHours: "",
    dueDate: "",
    notes: "",
    pfhRate: "",
    royaltyShareType: "",
    contractDate: "",
    expectedPayment: "",
    paymentDueDate: "",
    rightsReversionDate: "",
    royaltyNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const project = await createProject(form);
      router.push(`/app/projects/${project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-title">Title *</Label>
              <Input id="project-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-author">Author</Label>
                <Input id="project-author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
              </div>
              <div>
                <Label htmlFor="project-client-publisher">Client / Publisher</Label>
                <Input id="project-client-publisher" value={form.clientPublisher} onChange={(e) => setForm({ ...form, clientPublisher: e.target.value })} placeholder="Publisher or client" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-platform">Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v ?? "ACX" })}>
                  <SelectTrigger id="project-platform"><SelectValue /></SelectTrigger>
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
                <Label htmlFor="project-status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? "AUDITIONING" })}>
                  <SelectTrigger id="project-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUDITIONING">Auditioning</SelectItem>
                    <SelectItem value="CONTRACTED">Contracted</SelectItem>
                    <SelectItem value="RECORDING">Recording</SelectItem>
                    <SelectItem value="PROOFING">Proofing</SelectItem>
                    <SelectItem value="PICKUPS">Pickups</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-word-count">Word Count</Label>
                <Input id="project-word-count" type="number" value={form.wordCount} onChange={(e) => setForm({ ...form, wordCount: e.target.value })} placeholder="85000" />
              </div>
              <div>
                <Label htmlFor="project-estimated-hours">Estimated Hours</Label>
                <Input id="project-estimated-hours" type="number" step="0.1" value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })} placeholder="9.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="project-due-date">Due Date</Label>
              <Input id="project-due-date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="project-notes">Notes</Label>
              <Textarea id="project-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Business / Contract Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-contract-type">Contract Type</Label>
                <Select value={form.contractType} onValueChange={(v) => setForm({ ...form, contractType: v ?? "PFH" })}>
                  <SelectTrigger id="project-contract-type"><SelectValue /></SelectTrigger>
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
                <Label htmlFor="project-pfh-rate">PFH Rate ($/hr)</Label>
                <Input id="project-pfh-rate" type="number" step="0.01" value={form.pfhRate} onChange={(e) => setForm({ ...form, pfhRate: e.target.value })} placeholder="225.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-expected-payment">Expected Payment ($)</Label>
                <Input id="project-expected-payment" type="number" step="0.01" value={form.expectedPayment} onChange={(e) => setForm({ ...form, expectedPayment: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="project-royalty-share-type">Royalty Share Type</Label>
                <Input id="project-royalty-share-type" value={form.royaltyShareType} onChange={(e) => setForm({ ...form, royaltyShareType: e.target.value })} placeholder="e.g. 20% royalty" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project-contract-date">Contract Date</Label>
                <Input id="project-contract-date" type="date" value={form.contractDate} onChange={(e) => setForm({ ...form, contractDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="project-payment-due-date">Payment Due</Label>
                <Input id="project-payment-due-date" type="date" value={form.paymentDueDate} onChange={(e) => setForm({ ...form, paymentDueDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="project-rights-reversion-date">Rights Reversion Date</Label>
                <Input id="project-rights-reversion-date" type="date" value={form.rightsReversionDate} onChange={(e) => setForm({ ...form, rightsReversionDate: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="project-royalty-notes">Royalty Notes</Label>
              <Textarea id="project-royalty-notes" value={form.royaltyNotes} onChange={(e) => setForm({ ...form, royaltyNotes: e.target.value })} rows={2} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/app/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading || !form.title}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
