import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PronunciationGuidePost() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="text-xs text-gray-400 mb-3">May 20, 2025 · 6 min read</div>
        <h1 className="text-3xl font-bold mb-6">How to Build a Pronunciation Guide for Any Audiobook</h1>

        <div className="prose prose-gray max-w-none text-gray-700 space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            One of the most common listener complaints about audiobooks is inconsistent pronunciation — a character&apos;s name that shifts between recordings, a place name that changes accent mid-book, or technical terms that clearly were not researched. A systematic pronunciation guide solves all of this.
          </p>

          <p>
            Here is how professional narrators build pronunciation guides that are actually useful during recording.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why a Pronunciation Guide Matters</h2>

          <p>
            For fiction with invented names — fantasy, science fiction, historical — pronunciation is genuinely ambiguous. The author created the name, and only they know how it should sound. For non-fiction with technical terms, academic language, or foreign words, there are correct answers that can be researched.
          </p>

          <p>
            Either way, you need a written reference. Your brain will not reliably remember how you pronounced Aelindra in chapter 3 by the time you reach chapter 17. The guide is your consistency safety net.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Step 1: Flag Terms During Your Read-Through</h2>

          <p>
            During your pre-production read, highlight or note every term that could be challenging:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Character names (especially invented names)</li>
            <li>Place names (especially from other languages or cultures)</li>
            <li>Magic systems, technology, or invented terminology</li>
            <li>Foreign phrases or words</li>
            <li>Titles and honorifics</li>
            <li>Historical names you are not certain about</li>
          </ul>

          <p>
            Do not try to research while you read — that breaks your comprehension flow. Just flag everything and research as a separate pass.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Step 2: Research Each Term</h2>

          <p>
            For each flagged term, work through these sources in order of reliability:
          </p>

          <p><strong>Author-provided pronunciation guide.</strong> Some authors include pronunciation guides in their book or send them on request. Always ask. It takes 30 seconds to email the rights holder and can save hours of guessing.</p>

          <p><strong>Author interviews, podcasts, or videos.</strong> If the author has discussed their book publicly, they may have said character names aloud. A quick YouTube search for &quot;[author name] interview [book name]&quot; often surfaces this.</p>

          <p><strong>Dictionaries and language resources.</strong> For real words, names, and places, use Merriam-Webster, Forvo (crowd-sourced pronunciation database), the Oxford English Dictionary, and language-specific dictionaries.</p>

          <p><strong>Informed guessing with documentation.</strong> When no source exists, make a reasonable phonetic choice based on the word&apos;s apparent origin and document your reasoning. If the rights holder reviews your audio and disagrees, having your logic documented makes the conversation easier.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Step 3: Write It Down Consistently</h2>

          <p>
            Your phonetic notation does not need to be formal IPA — it just needs to be readable by you during recording. Common conventions:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Use ALL CAPS for the stressed syllable: vel-THAR-ee-on</li>
            <li>Use hyphens to separate syllables: AY-lin-dra</li>
            <li>Use familiar words as phonetic anchors: rhymes with &quot;together,&quot; sounds like &quot;cavalier&quot;</li>
          </ul>

          <p>
            Include the source for every entry. When a rights holder asks why you pronounced something a certain way, &quot;Author pronunciation guide, page 3&quot; is a much better answer than &quot;I guessed.&quot;
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Step 4: Keep It Accessible During Recording</h2>

          <p>
            Your pronunciation guide is only useful if you actually use it. During recording:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Keep it open in a second window or on a tablet next to your recording setup</li>
            <li>Search it before each chapter for terms that appear in that chapter</li>
            <li>Update the Status column as you confirm each term during recording</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Step 5: Handle Corrections Gracefully</h2>

          <p>
            Sometimes a rights holder will flag pronunciation issues after review. When this happens:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Update your guide immediately with the correct pronunciation and the source (e.g., &quot;Rights holder correction, [date]&quot;)</li>
            <li>Add it to your pickup log as a pickup needed</li>
            <li>Check if the same term appears elsewhere in the recording and flag those too</li>
          </ul>

          <p>
            A well-maintained guide means you only have to have each pronunciation conversation once.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Tools for Building Your Guide</h2>

          <p>
            Many narrators start with a spreadsheet, which works fine for a single project. The challenge comes when you are managing multiple projects simultaneously — keeping separate files organized, finding the right version, and updating them consistently across projects.
          </p>

          <p>
            NarratorStudio has a built-in pronunciation tracker for each project, with fields for term, phonetic spelling, category, source, notes, and status. You can export to CSV when needed and see all your research organized by project.
          </p>
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">Track pronunciations inside your projects</h2>
          <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto">
            NarratorStudio gives every project a built-in pronunciation guide — no separate spreadsheet required.
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
