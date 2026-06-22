import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PickupTrackingBlogPage() {
  return (
    <article className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-3">Pickup workflow</p>
        <h1 className="text-4xl font-bold mb-4">How to Track Audiobook Pickups Without Losing Context</h1>
        <p className="text-lg text-gray-600 mb-8">
          A useful pickup tracker should tell you what went wrong, where it happened, what to record, and whether the fix has been approved.
        </p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Use consistent fields</h2>
            <p>Track chapter, timestamp or page, issue type, original text, corrected text, status, and notes. This makes pickup sessions faster and keeps proofing feedback actionable.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Separate statuses from notes</h2>
            <p>Status should be scannable: open, recorded, sent, or approved. Keep explanations in notes so the list can still be filtered quickly.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Export when you need to hand off</h2>
            <p>CSV works well for authors, publishers, and producers because it can move into spreadsheets without special software.</p>
          </section>
        </div>
        <div className="bg-red-50 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">Use the free pickup template</h2>
          <p className="text-gray-700 mb-4">Download the spreadsheet or manage pickups directly inside a NarratorStudio project.</p>
          <div className="flex gap-3">
            <Link href="/templates/audiobook-pickup-notes"><Button variant="outline">View Template</Button></Link>
            <Link href="/signup"><Button>Start Free Trial</Button></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
