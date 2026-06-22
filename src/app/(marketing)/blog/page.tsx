import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const POSTS = [
  {
    slug: "acx-narrator-workflow",
    title: "The Complete ACX Narrator Workflow: From Audition to Delivery",
    excerpt: "A step-by-step guide to managing an audiobook project on ACX — from finding the right title to delivering the finished files and getting paid.",
    date: "June 1, 2025",
    readTime: "8 min read",
  },
  {
    slug: "pronunciation-guide-for-narrators",
    title: "How to Build a Pronunciation Guide for Any Audiobook",
    excerpt: "Everything you need to know about researching, documenting, and using pronunciation guides to deliver consistent, author-approved narration.",
    date: "May 20, 2025",
    readTime: "6 min read",
  },
  {
    slug: "best-software-for-audiobook-narration",
    title: "Best Software for Audiobook Narration Project Management",
    excerpt: "How narrators can choose tools for auditions, pronunciations, pickups, invoices, contracts, and rights dates.",
    date: "June 8, 2025",
    readTime: "7 min read",
  },
  {
    slug: "how-to-track-audiobook-pickups",
    title: "How to Track Audiobook Pickups Without Losing Context",
    excerpt: "A practical pickup workflow for chapter, timestamp, issue type, correction text, recording status, and approval status.",
    date: "June 12, 2025",
    readTime: "5 min read",
  },
  {
    slug: "how-to-build-an-acx-pronunciation-sheet",
    title: "How to Build an ACX Pronunciation Sheet",
    excerpt: "The fields every ACX narrator should track before recording: terms, phonetics, sources, categories, notes, and status.",
    date: "June 16, 2025",
    readTime: "6 min read",
  },
  {
    slug: "pfh-vs-royalty-share-tracking-for-narrators",
    title: "PFH vs Royalty Share Tracking for Narrators",
    excerpt: "What to track for PFH, royalty share, and royalty share plus projects so contracts, invoices, and rights dates stay visible.",
    date: "June 20, 2025",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Blog</h1>
        <p className="text-gray-600 mb-10">Workflow tips, business advice, and resources for professional audiobook narrators.</p>

        <div className="space-y-6">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
