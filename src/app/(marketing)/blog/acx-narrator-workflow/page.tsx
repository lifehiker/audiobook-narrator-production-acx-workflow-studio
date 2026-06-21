import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ACXNarratorWorkflowPost() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="text-xs text-gray-400 mb-3">June 1, 2025 · 8 min read</div>
        <h1 className="text-3xl font-bold mb-6">The Complete ACX Narrator Workflow: From Audition to Delivery</h1>

        <div className="prose prose-gray max-w-none text-gray-700 space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Professional audiobook narration on ACX involves far more than sitting in front of a microphone and reading. Behind every finished audiobook is a structured workflow that spans months — from your initial audition through recording, proofing, pickup sessions, and final delivery.
          </p>

          <p>
            In this guide, we break down the complete ACX narrator workflow into manageable phases so you can stay organized, meet deadlines, and get paid reliably.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Phase 1: Finding and Winning Projects</h2>

          <p>
            Most ACX narrators start by browsing the marketplace for titles that match their voice type and genre expertise. Before auditioning, evaluate each project carefully:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Word count and estimated finished hours (roughly 9,000-10,000 words per finished hour for prose)</li>
            <li>Contract type: Per Finished Hour (PFH), Royalty Share, or Royalty Share Plus</li>
            <li>Rights holder reputation and communication style</li>
            <li>Timeline expectations relative to your current workload</li>
          </ul>

          <p>
            Track every audition you submit — title, author, rights holder, rate terms, and submission date. Your win rate over time tells you which genres and contract types are most profitable for your voice type.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Phase 2: Pre-Production</h2>

          <p>
            Once you win a project, the work begins before you record a single word. Pre-production sets you up for a smooth recording session:
          </p>

          <p><strong>Read the manuscript first.</strong> A full read-through before recording is non-negotiable. You need to understand character arcs, identify unfamiliar terms, and mark passages that require special interpretation.</p>

          <p><strong>Build your pronunciation guide.</strong> Every audiobook has challenging words — character names, place names, foreign phrases, technical terminology, invented language. For each term:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Note the term and where it first appears</li>
            <li>Research the phonetic spelling using dictionaries, author notes, or direct outreach</li>
            <li>Document your source so you can cite it if questioned</li>
            <li>Mark terms still needing research so you don&apos;t miss them before recording</li>
          </ul>

          <p><strong>Create your character sheet.</strong> For books with multiple characters, document each character&apos;s voice, accent, age, and relationship to other characters. Consistency across 9+ hours of audio requires a reference document you can check during recording.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Phase 3: Recording</h2>

          <p>
            Recording workflow varies by narrator, but most professionals record chapter by chapter, doing a raw pass first and flagging issues in real time. Common approaches:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Record to a DAW (Reaper, Adobe Audition, Logic) with a consistent setup</li>
            <li>Use an error flagging method — spoken notes, markers, or a pickup log — to note retakes needed</li>
            <li>Record pickups for obvious errors immediately or consolidate at end of session</li>
            <li>Keep your pronunciation guide open and visible during recording</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Phase 4: Proofing and Pickups</h2>

          <p>
            Proofing is where most narrators catch the issues that slipped through recording. This phase involves listening through the raw recordings (or having a proofer listen) and logging every correction needed.
          </p>

          <p>
            A good pickup log tracks: chapter, timecode, issue type (misread, pronunciation, noise, pacing, missing line), the original text, the corrected version, and status. Without a systematic log, pickup sessions become chaotic — you end up hunting through hours of audio trying to remember which scene had the noise problem.
          </p>

          <p>
            ACX standards require specific technical specifications: noise floor, RMS levels, peak amplitude, and file format. Run your finished audio through a QC tool before submission to catch technical issues.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Phase 5: Delivery and Payment</h2>

          <p>
            Once your audio passes QC, you upload to ACX and the rights holder has a review window (typically 2 weeks). After approval, you&apos;ll need to:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Track your invoice for PFH projects and follow up on payment</li>
            <li>Note your contract&apos;s rights reversion date (typically 7 years for ACX exclusive, though this varies)</li>
            <li>Update your project status and archive the project once paid</li>
          </ul>

          <p>
            Rights reversion dates are easy to forget — but missing one means missing the opportunity to reclaim your rights and republish or record a new version elsewhere. Calendar these dates the moment you sign a contract.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Keeping It All Together</h2>

          <p>
            Many narrators start out managing their workflow in scattered tools: a folder of Word docs for pronunciation guides, a spreadsheet for auditions, another spreadsheet for invoices, calendar reminders for rights dates. This works when you have one or two projects. It breaks down when you have eight.
          </p>

          <p>
            NarratorStudio is built specifically for this workflow — all of the above in one place, per project, with automatic alerts for overdue invoices and upcoming rights reversion dates.
          </p>
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">Manage your entire ACX workflow in one place</h2>
          <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto">
            Pronunciation guides, pickup logs, audition tracking, invoices, and rights dates — all built for the way narrators actually work.
          </p>
          <Link href="/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <p className="text-xs text-gray-400 mt-2">No credit card required</p>
        </div>
      </div>
    </div>
  );
}
