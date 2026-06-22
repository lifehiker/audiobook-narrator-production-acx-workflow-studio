import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PfhRoyaltyTrackingBlogPage() {
  return (
    <article className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-3">Business tracking</p>
        <h1 className="text-4xl font-bold mb-4">PFH vs Royalty Share Tracking for Narrators</h1>
        <p className="text-lg text-gray-600 mb-8">
          PFH, royalty share, royalty share plus, flat fee, and direct publisher work all need different follow-up fields.
        </p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">PFH projects</h2>
            <p>Track PFH rate, estimated finished hours, invoice amount, sent date, due date, paid date, and delivery status.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Royalty share projects</h2>
            <p>Track contract date, royalty terms, platform, expected payment events, rights reversion date, and long-term reminder windows.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Royalty share plus projects</h2>
            <p>Track both sides: the stipend or PFH-like payment and the future royalty/rights details.</p>
          </section>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">Keep contract fields on the project</h2>
          <p className="text-gray-700 mb-4">NarratorStudio stores business fields with the audiobook workspace so they stay connected to invoices, pickups, and delivery status.</p>
          <Link href="/signup"><Button>Start Free Trial</Button></Link>
        </div>
      </div>
    </article>
  );
}
