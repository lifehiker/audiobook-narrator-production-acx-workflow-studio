import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

const SAMPLE_DATA = [
  { chapter: "3", timecode: "00:12:34", issueType: "Pronunciation", original: "Veltharion rose from the depths", correction: "Re-record: vel-THAR-ee-on", notes: "Stressed wrong syllable", status: "Open" },
  { chapter: "5", timecode: "00:28:15", issueType: "Noise", original: "All of chapter 5, para 3", correction: "Re-record full paragraph", notes: "HVAC kicked on", status: "Recorded" },
  { chapter: "7", timecode: "00:45:02", issueType: "Misread", original: "She ran quickly toward the door", correction: "She ran swiftly toward the door", notes: "Wrong word", status: "Open" },
  { chapter: "9", timecode: "01:02:18", issueType: "Pacing", original: "The council met at dawn", correction: "Slow down — this is a pivotal scene", notes: "Too fast through the reveal", status: "Recorded" },
  { chapter: "11", timecode: "01:15:44", issueType: "Missing Line", original: "", correction: "Missing: 'She had always known this day would come.'", notes: "Line completely skipped", status: "Sent" },
];

export default function PickupTrackerTemplatePage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">Audiobook Pickup Notes Template</h1>
            <p className="text-gray-600 text-lg">
              Track every pickup needed during your audiobook production, including misreads, noise issues, pronunciation errors, and missing lines.
            </p>
          </div>
          <a href="/templates/audiobook-pickup-notes.csv" download>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </a>
        </div>

        <div className="bg-red-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-red-900 mb-3">How to use this template</h2>
          <ol className="space-y-2 text-sm text-red-800">
            <li>1. During proofing, add a row for each issue you find.</li>
            <li>2. Note the chapter and timecode so you can find the exact spot quickly.</li>
            <li>3. Describe what needs to change in the Correction column.</li>
            <li>4. Update Status as you record, send, and get approval.</li>
            <li>5. Sort by Status to quickly see what is still open.</li>
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
                  { col: "Chapter", desc: "Chapter number where the issue occurs", ex: "7" },
                  { col: "Timecode", desc: "Approximate timecode in the chapter audio file", ex: "00:45:02" },
                  { col: "Issue Type", desc: "Misread / Pronunciation / Noise / Pacing / Missing Line / Other", ex: "Misread" },
                  { col: "Original Text", desc: "What was actually said or what the problem is", ex: "She ran quickly toward the door" },
                  { col: "Correction Needed", desc: "What needs to be recorded to fix the issue", ex: "She ran swiftly toward the door" },
                  { col: "Notes", desc: "Additional context or instructions", ex: "Book text says swiftly on p.142" },
                  { col: "Status", desc: "Open / Recorded / Sent / Approved", ex: "Open" },
                ].map((row) => (
                  <tr key={row.col} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{row.col}</td>
                    <td className="px-4 py-3 text-gray-600">{row.desc}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{row.ex}</td>
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
                  {["Ch.", "Timecode", "Issue", "Original", "Correction", "Notes", "Status"].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 font-medium text-gray-700 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {SAMPLE_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium">{row.chapter}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-600">{row.timecode}</td>
                    <td className="px-3 py-2.5 text-xs">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{row.issueType}</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs line-through">{row.original || "—"}</td>
                    <td className="px-3 py-2.5 text-gray-800 text-xs">{row.correction}</td>
                    <td className="px-3 py-2.5 text-gray-400 text-xs">{row.notes}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.status === "Approved" ? "bg-green-100 text-green-700" :
                        row.status === "Sent" ? "bg-yellow-100 text-yellow-700" :
                        row.status === "Recorded" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Track pickups inside your project</h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            NarratorStudio gives you built-in pickup tracking per project — with status filters, open pickup counts on your dashboard, and CSV export when you need it.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline">Browse Templates</Button>
            </Link>
            <a href="/templates/audiobook-pickup-notes.csv" download>
              <Button variant="outline">Download CSV</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
