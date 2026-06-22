import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AcxPronunciationSheetBlogPage() {
  return (
    <article className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-3">Pronunciation prep</p>
        <h1 className="text-4xl font-bold mb-4">How to Build an ACX Pronunciation Sheet</h1>
        <p className="text-lg text-gray-600 mb-8">
          An ACX pronunciation sheet should be searchable, source-backed, and easy to bring into the booth.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {["Term or name", "Phonetic spelling", "Category", "Source/reference", "Notes", "Status"].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <h2 className="font-semibold">{item}</h2>
              <p className="text-sm text-gray-600 mt-1">Keep this field consistent so the sheet can be filtered during prep and recording.</p>
            </div>
          ))}
        </div>
        <p className="text-gray-700">
          For status, use a small set of values such as needs research, confirmed, and recorded. That makes it clear which entries still require author or source verification.
        </p>
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">Start with the free CSV</h2>
          <p className="text-gray-700 mb-4">Use the template page for a downloadable sheet, or create a project workspace and copy/export pronunciations from there.</p>
          <div className="flex gap-3">
            <Link href="/templates/acx-pronunciation-sheet"><Button variant="outline">View Template</Button></Link>
            <Link href="/signup"><Button>Start Free Trial</Button></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
