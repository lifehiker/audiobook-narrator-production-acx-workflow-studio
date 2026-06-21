import Link from "next/link";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Headphones className="h-6 w-6 text-blue-600" />
            NarratorStudio
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/templates" className="hover:text-gray-900">Templates</Link>
            <Link href="/blog" className="hover:text-gray-900">Blog</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-gray-50 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold mb-3">
                <Headphones className="h-5 w-5 text-blue-600" />
                NarratorStudio
              </div>
              <p className="text-sm text-gray-500">The workflow tool built for professional audiobook narrators.</p>
            </div>
            <div>
              <div className="font-medium text-sm mb-3">Product</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-gray-900">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-sm mb-3">Resources</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/templates" className="hover:text-gray-900">Templates</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-sm mb-3">Account</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/login" className="hover:text-gray-900">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-gray-900">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} NarratorStudio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
