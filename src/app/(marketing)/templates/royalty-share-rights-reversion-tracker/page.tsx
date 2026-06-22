import Link from "next/link";
import { ArrowLeft, CalendarClock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS = [
  ["Project", "Audiobook title", "Winter Parish"],
  ["Contract Type", "PFH, Royalty Share, Royalty Share Plus, Flat Fee, or Other", "Royalty Share Plus"],
  ["Royalty Terms", "Revenue split or bonus notes", "50/50 royalty split plus stipend"],
  ["Contract Date", "Date terms were agreed", "2026-05-20"],
  ["Rights Reversion", "Rights reversion or review date", "2033-05-20"],
  ["Reminder", "Follow-up window", "90 days before"],
  ["Notes", "Client, platform, and contract context", "ACX exclusive term"],
];

export default function RoyaltyRightsTemplatePage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-4">
              <CalendarClock className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Royalty Share and Rights Reversion Tracker</h1>
            <p className="text-gray-600 text-lg">
              Keep PFH, royalty share, royalty share plus, contract dates, payment expectations, and rights reversion reminders in one sheet.
            </p>
          </div>
          <a href="/templates/royalty-share-rights-reversion-tracker.csv" download>
            <Button><Download className="h-4 w-4 mr-2" /> Download CSV</Button>
          </a>
        </div>

        <div className="bg-amber-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-amber-900 mb-3">Why narrators track this</h2>
          <p className="text-sm text-amber-800">
            Royalty share projects can stay relevant for years. A dedicated tracker helps you remember contract terms,
            payment expectations, and rights windows without digging through old emails.
          </p>
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
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Track contract dates inside each project</h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            NarratorStudio stores PFH rates, royalty notes, expected payments, payment due dates, and rights reversion dates on every project.
          </p>
          <Link href="/signup"><Button>Start Free Trial</Button></Link>
        </div>
      </div>
    </div>
  );
}
