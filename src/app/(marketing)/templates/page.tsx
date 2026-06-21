import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BookOpen, AlertCircle, Mic2 } from "lucide-react";

const TEMPLATES = [
  {
    slug: "acx-pronunciation-sheet",
    download: "/templates/acx-pronunciation-sheet.csv",
    icon: BookOpen,
    title: "ACX Pronunciation Sheet Template",
    description: "A structured spreadsheet template for tracking pronunciation terms, phonetic spellings, sources, and confirmation status across your audiobook projects.",
    fields: ["Term", "Phonetic Spelling", "Category", "Source/Reference", "Notes", "Status"],
    color: "bg-blue-50 text-blue-600",
  },
  {
    slug: "audiobook-pickup-notes",
    download: "/templates/audiobook-pickup-notes.csv",
    icon: AlertCircle,
    title: "Audiobook Pickup Notes Template",
    description: "Track every pickup needed — misreads, noise issues, pronunciation corrections — organized by chapter and timecode with status tracking.",
    fields: ["Chapter", "Timecode", "Issue Type", "Original Text", "Correction Needed", "Notes", "Status"],
    color: "bg-red-50 text-red-600",
  },
  {
    slug: "acx-audition-tracker",
    download: "/templates/acx-audition-tracker.csv",
    icon: Mic2,
    title: "ACX Audition Tracker Template",
    description: "Track saved, submitted, shortlisted, won, and lost auditions with title, platform, submission date, rate terms, and follow-up notes.",
    fields: ["Title", "Author", "Client/Publisher", "Platform", "Submitted Date", "Rate/Terms", "Status"],
    color: "bg-purple-50 text-purple-600",
  },
];

export default function TemplatesPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Templates for Audiobook Narrators</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download free spreadsheet templates for your narration workflow. Or use NarratorStudio to manage everything in one place — no spreadsheets required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TEMPLATES.map((tpl) => (
            <Card key={tpl.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${tpl.color}`}>
                  <tpl.icon className="h-6 w-6" />
                </div>
                <CardTitle>{tpl.title}</CardTitle>
                <p className="text-sm text-gray-600">{tpl.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Includes columns for:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.fields.map((f) => (
                      <span key={f} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/templates/${tpl.slug}`} className="flex-1">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" /> View Template
                    </Button>
                  </Link>
                  <a href={tpl.download} download>
                    <Button variant="outline" aria-label={`Download ${tpl.title}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Skip the spreadsheets entirely</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            NarratorStudio gives you built-in pronunciation tracking, pickup logs, audition pipeline management, and invoice tracking — all in one tool built for narrators.
          </p>
          <Link href="/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <p className="text-sm text-gray-500 mt-3">No credit card required</p>
        </div>
      </div>
    </div>
  );
}
