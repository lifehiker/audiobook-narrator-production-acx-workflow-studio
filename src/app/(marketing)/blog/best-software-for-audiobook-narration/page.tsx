import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BestSoftwarePage() {
  return (
    <article className="py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-gray">
        <p className="text-sm text-gray-500 mb-3">Audiobook workflow</p>
        <h1 className="text-4xl font-bold mb-4">Best Software for Audiobook Narration Project Management</h1>
        <p className="text-lg text-gray-600 mb-8">
          The best narration workflow stack keeps creative prep, production notes, and business follow-up visible without forcing a narrator to rebuild a database for every title.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-3">What the software should cover</h2>
        <ul className="space-y-2 text-gray-700">
          <li>Pronunciation dictionaries with source notes and confirmation status.</li>
          <li>Character and name consistency notes for long manuscripts.</li>
          <li>Pickup tracking by chapter, timestamp, issue type, correction, and approval status.</li>
          <li>Audition pipeline tracking across ACX, Findaway, direct clients, and publishers.</li>
          <li>Invoice, payment due date, royalty share, and rights reversion tracking.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-3">Why generic tools break down</h2>
        <p className="text-gray-700">
          Spreadsheets, Notion, Airtable, and DAW markers can each handle part of the job, but they rarely connect a title&apos;s creative notes to business dates and follow-up. Narrators need a project workspace that starts with audiobook-specific fields.
        </p>
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">Try a narrator-specific workspace</h2>
          <p className="text-gray-700 mb-4">NarratorStudio combines projects, pronunciations, pickups, auditions, invoices, and rights dates in one browser workspace.</p>
          <Link href="/signup"><Button>Start Free Trial</Button></Link>
        </div>
      </div>
    </article>
  );
}
