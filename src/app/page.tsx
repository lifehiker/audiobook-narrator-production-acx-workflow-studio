import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Mic2, FileText, AlertCircle, Calendar, Download, Headphones, Mail, Search, CircleHelp } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Nav */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Headphones className="h-6 w-6 text-blue-600" />
            NarratorStudio
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/templates" className="hover:text-gray-900">Templates</Link>
            <Link href="/blog" className="hover:text-gray-900">Blog</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/signup"><Button size="sm">Start Free Trial</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Headphones className="h-4 w-4" />
            Built for ACX narrators
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            One workspace for your entire
            <span className="text-blue-600"> narration business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            One workspace for ACX pronunciations, pickups, auditions, invoices, and rights dates.
            Stop managing your narration career in scattered spreadsheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">Start Free Trial — No Credit Card</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-base px-8">View Pricing</Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">14-day free trial · no credit card required</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">Sound familiar?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { pain: "Hunting through emails to find pronunciation notes from your author", icon: Mail, tone: "text-blue-600 bg-blue-50" },
              { pain: "Losing track of open pickups across multiple chapters of a long book", icon: Search, tone: "text-red-600 bg-red-50" },
              { pain: "Forgetting your rights reversion date until it's already passed", icon: Calendar, tone: "text-amber-600 bg-amber-50" },
              { pain: "Juggling invoices in a spreadsheet that you update once a month", icon: FileText, tone: "text-green-600 bg-green-50" },
              { pain: "Can't remember if you ever heard back on that audition you submitted 3 months ago", icon: CircleHelp, tone: "text-purple-600 bg-purple-50" },
              { pain: "Starting every project with a blank doc and recreating your character sheet template", icon: BookOpen, tone: "text-teal-600 bg-teal-50" },
            ].map((item) => (
              <div key={item.pain} className="bg-white border rounded-xl p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-gray-700 text-sm">{item.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need in one place</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            NarratorStudio is built specifically for the audiobook narrator workflow — from audition to payment.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Pronunciation Tracker",
                desc: "Capture every tricky term with phonetic spelling, source, and status. Export to CSV for your recording session.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: AlertCircle,
                title: "Pickup Log",
                desc: "Track misreads, noise issues, and pronunciation corrections by chapter and timecode. Never miss a re-record.",
                color: "text-red-600 bg-red-50",
              },
              {
                icon: Mic2,
                title: "Audition Pipeline",
                desc: "Log every audition with status, rate terms, and outcome. Track your win rate and pipeline at a glance.",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: FileText,
                title: "Invoice Management",
                desc: "Create, track, and export invoices across all your projects. Get alerted when invoices go overdue.",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Calendar,
                title: "Rights and Dates",
                desc: "Never miss a rights reversion date. Track contract dates, payment due dates, and royalty terms per project.",
                color: "text-amber-600 bg-amber-50",
              },
              {
                icon: Download,
                title: "CSV Export",
                desc: "Export pronunciations, pickups, auditions, and invoices as CSV for any external tool or reporting need.",
                color: "text-teal-600 bg-teal-50",
              },
            ].map((feature) => (
              <Card key={feature.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-600 mb-10">Start free. Upgrade when you need more projects.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { name: "Solo", price: "$19", desc: "Up to 5 active projects" },
              { name: "Pro", price: "$29", desc: "Unlimited projects", popular: true },
              { name: "Studio", price: "$49", desc: "Multi-narrator support" },
            ].map((p) => (
              <div
                key={p.name}
                className={`bg-white rounded-xl border p-6 ${p.popular ? "border-blue-500 shadow-md ring-1 ring-blue-500" : ""}`}
              >
                {p.popular && <div className="text-xs font-medium text-blue-600 mb-2">MOST POPULAR</div>}
                <div className="text-2xl font-bold">{p.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="font-semibold text-lg mt-1 mb-2">{p.name}</div>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing"><Button variant="outline">See full pricing details</Button></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start organizing your narration career today</h2>
          <p className="text-blue-100 mb-8">Join narrators who use NarratorStudio to stay on top of every project, pickup, and payment.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-base px-8">Start Your Free Trial</Button>
          </Link>
          <p className="text-blue-200 text-sm mt-4">No credit card required · 14-day trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} NarratorStudio. All rights reserved.
          {" · "}<Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          {" · "}<Link href="/templates" className="hover:text-gray-600">Templates</Link>
          {" · "}<Link href="/blog" className="hover:text-gray-600">Blog</Link>
        </div>
      </footer>
    </div>
  );
}
