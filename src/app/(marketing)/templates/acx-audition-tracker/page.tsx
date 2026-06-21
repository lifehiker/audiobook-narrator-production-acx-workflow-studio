import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

const SAMPLE_DATA = [
  {
    title: "The Glass Harbor",
    author: "Lena Price",
    client: "ACX Rights Holder",
    platform: "ACX",
    auditionDate: "2026-06-01",
    submittedDate: "2026-06-02",
    rateTerms: "PFH $225",
    status: "Submitted",
    notes: "Follow up after 2 weeks",
  },
  {
    title: "Winter Parish",
    author: "Samir Holt",
    client: "Direct Author",
    platform: "Direct",
    auditionDate: "2026-06-04",
    submittedDate: "2026-06-05",
    rateTerms: "Royalty Share Plus",
    status: "Shortlisted",
    notes: "Requested additional sample",
  },
  {
    title: "The Last Orchard",
    author: "Maya Chen",
    client: "Small Publisher",
    platform: "Publisher",
    auditionDate: "2026-06-08",
    submittedDate: "",
    rateTerms: "PFH $250",
    status: "Saved",
    notes: "Need to record sample",
  },
];

export default function AcxAuditionTrackerTemplatePage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">ACX Audition Tracker Template</h1>
            <p className="text-gray-600 text-lg">
              Track saved, submitted, shortlisted, won, and lost auditions across ACX, direct clients, Findaway, and publisher work.
            </p>
          </div>
          <a href="/templates/acx-audition-tracker.csv" download>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </a>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-purple-900 mb-3">How to use this template</h2>
          <ol className="space-y-2 text-sm text-purple-800">
            <li>1. Add every audition as soon as you save or record it.</li>
            <li>2. Record the platform, client, rate terms, and submission date.</li>
            <li>3. Update status as each title moves from submitted to won, lost, or no response.</li>
            <li>4. Review your pipeline weekly so promising auditions do not disappear.</li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Column Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Column</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Description</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["Title", "Book or project title", "The Glass Harbor"],
                  ["Author", "Author name when known", "Lena Price"],
                  ["Client/Publisher", "Rights holder, author, or publisher", "ACX Rights Holder"],
                  ["Platform", "ACX, Findaway, Direct, Publisher, or Other", "ACX"],
                  ["Audition Date", "Date you recorded or prepared the audition", "2026-06-01"],
                  ["Submitted Date", "Date you submitted the audition", "2026-06-02"],
                  ["Rate/Terms", "PFH, royalty share, royalty share plus, or other terms", "PFH $225"],
                  ["Status", "Saved, Submitted, Shortlisted, Won, Lost, No Response", "Submitted"],
                ].map(([col, desc, ex]) => (
                  <tr key={col} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{col}</td>
                    <td className="px-4 py-3 text-gray-600">{desc}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {["Title", "Client", "Platform", "Submitted", "Rate/Terms", "Status", "Notes"].map((heading) => (
                    <th key={heading} className="text-left px-3 py-2.5 font-medium text-gray-700 text-xs uppercase tracking-wide">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {SAMPLE_DATA.map((row) => (
                  <tr key={row.title} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{row.title}</div>
                      <div className="text-xs text-gray-500">by {row.author}</div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{row.client}</td>
                    <td className="px-3 py-2.5 text-gray-600">{row.platform}</td>
                    <td className="px-3 py-2.5 text-gray-500">{row.submittedDate || "-"}</td>
                    <td className="px-3 py-2.5 text-gray-600">{row.rateTerms}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Track auditions inside NarratorStudio</h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            Use the built-in audition pipeline to update status, export CSV, and keep auditions connected to the rest of your narration business.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
            <a href="/templates/acx-audition-tracker.csv" download>
              <Button variant="outline">Download CSV</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
