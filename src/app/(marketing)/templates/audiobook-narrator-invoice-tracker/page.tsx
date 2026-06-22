import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS = [
  ["Project", "Audiobook title or client project", "The Glass Harbor"],
  ["Invoice #", "Your invoice identifier", "INV-2026-014"],
  ["Amount", "Invoice total", "$2,450"],
  ["Sent Date", "Date sent to the client", "2026-06-12"],
  ["Due Date", "Payment due date", "2026-07-12"],
  ["Paid Date", "Date payment arrived", ""],
  ["Status", "Draft, Sent, Overdue, or Paid", "Sent"],
];

export default function InvoiceTrackerTemplatePage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Audiobook Narrator Invoice Tracker</h1>
            <p className="text-gray-600 text-lg">
              Track invoice numbers, PFH payments, sent dates, due dates, paid dates, and overdue follow-up across audiobook clients.
            </p>
          </div>
          <a href="/templates/audiobook-narrator-invoice-tracker.csv" download>
            <Button><Download className="h-4 w-4 mr-2" /> Download CSV</Button>
          </a>
        </div>

        <div className="bg-emerald-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-emerald-900 mb-3">How to use this tracker</h2>
          <ol className="space-y-2 text-sm text-emerald-800">
            <li>1. Add a row as soon as an invoice is drafted or sent.</li>
            <li>2. Record the due date from your contract or payment terms.</li>
            <li>3. Review open and overdue invoices weekly.</li>
            <li>4. Mark paid invoices with the actual payment date for clean reporting.</li>
          </ol>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Column</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {COLUMNS.map(([column, description, example]) => (
                <tr key={column} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{column}</td>
                  <td className="px-4 py-3 text-gray-600">{description}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{example || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Need invoice reminders, not just a sheet?</h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            NarratorStudio connects invoices to projects, payment due dates, and daily reminder checks.
          </p>
          <Link href="/signup"><Button>Start Free Trial</Button></Link>
        </div>
      </div>
    </div>
  );
}
