import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

const SAMPLE_DATA = [
  { term: "Aelindra", phonetic: "AY-lin-dra", category: "Character", source: "Author email", notes: "Protagonist's name", status: "Confirmed" },
  { term: "Veltharion", phonetic: "vel-THAR-ee-on", category: "Character", source: "Book glossary", notes: "Dragon lord, ancient", status: "Confirmed" },
  { term: "Quelithas", phonetic: "kweh-LI-thas", category: "Place", source: "Pronunciation guide p.3", notes: "Mountain range in act 2", status: "Needs Research" },
  { term: "Drakneth", phonetic: "DRAK-neth", category: "Character", source: "Author pronunciation guide", notes: "Secondary antagonist", status: "Recorded" },
  { term: "Ithraelen", phonetic: "ith-RAY-eh-len", category: "Place", source: "Guessed from context", notes: "River — verify with author", status: "Needs Research" },
  { term: "Solvara", phonetic: "sol-VAR-ah", category: "Magic System", source: "World-building document", notes: "The binding magic", status: "Confirmed" },
];

export default function PronunciationGuideTemplatePage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">ACX Pronunciation Sheet Template</h1>
            <p className="text-gray-600 text-lg">
              A structured template for tracking every pronunciation term in your audiobook project, from character names to place names, magic systems, and technical jargon.
            </p>
          </div>
          <a href="/templates/acx-pronunciation-sheet.csv" download>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </a>
        </div>

        {/* How to use */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-blue-900 mb-3">How to use this template</h2>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Download the CSV and open it in Google Sheets, Excel, or Numbers.</li>
            <li>2. For each new project, make a copy and rename it with the book title.</li>
            <li>3. Add terms as you encounter them during your first read-through.</li>
            <li>4. Research phonetic spellings and confirm with the author when possible.</li>
            <li>5. Update the Status column as you record each term.</li>
          </ol>
        </div>

        {/* Field descriptions */}
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
                  { col: "Term", desc: "The word or name as written in the text", ex: "Veltharion" },
                  { col: "Phonetic Spelling", desc: "Your phonetic guide using syllable breaks and stress marks", ex: "vel-THAR-ee-on" },
                  { col: "Category", desc: "Type of term: Character, Place, Magic System, Title, Other", ex: "Character" },
                  { col: "Source", desc: "Where you confirmed the pronunciation from", ex: "Author email 2/14" },
                  { col: "Notes", desc: "Additional context, relationship to story, accent notes", ex: "Ancient, authoritative — uses formal speech" },
                  { col: "Status", desc: "Needs Research / Confirmed / Recorded", ex: "Confirmed" },
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

        {/* Sample data */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {["Term", "Phonetic", "Category", "Source", "Notes", "Status"].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 font-medium text-gray-700 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {SAMPLE_DATA.map((row) => (
                  <tr key={row.term} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium">{row.term}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-600">{row.phonetic}</td>
                    <td className="px-3 py-2.5 text-gray-600">{row.category}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{row.source}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{row.notes}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.status === "Confirmed" ? "bg-green-100 text-green-700" :
                        row.status === "Recorded" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
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

        {/* CTA */}
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Use NarratorStudio instead</h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            Get pronunciation tracking built into your project workflow — plus pickups, characters, invoices, and more. No spreadsheet juggling required.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline">Browse Templates</Button>
            </Link>
            <a href="/templates/acx-pronunciation-sheet.csv" download>
              <Button variant="outline">Download CSV</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
