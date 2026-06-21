"use client";

import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 border-b bg-white flex items-center justify-end px-6 flex-shrink-0">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <span className="hidden sm:block">{user.name ?? user.email}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-white shadow-lg z-20 p-1">
              <div className="px-3 py-2 text-xs text-gray-500 border-b mb-1">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div>{user.email}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
