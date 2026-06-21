"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { deleteCurrentAccount, updateProfile } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SettingsFormProps = {
  user: {
    name: string | null;
    email: string;
  };
};

export function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await updateProfile({ name });
        setMessage("Profile saved.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save profile.");
      }
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteCurrentAccount();
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage account details and production reminder preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">Email changes require creating a new account in this local build.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
              {message && (
                <span className="inline-flex items-center gap-1 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </span>
              )}
              {error && (
                <span className="inline-flex items-center gap-1 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            The daily reminder job scans your active projects for overdue invoices, payments due in the next week,
            and rights reversion dates in the next 90 days.
          </p>
          <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
            <div className="rounded-lg border border-red-100 bg-red-50 p-3">
              <div className="font-medium text-red-800">Overdue invoices</div>
              <p className="mt-1 text-xs text-red-700">Open invoices past their due date.</p>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
              <div className="font-medium text-amber-800">Upcoming payments</div>
              <p className="mt-1 text-xs text-amber-700">Unpaid invoices due within seven days.</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
              <div className="font-medium text-indigo-800">Rights dates</div>
              <p className="mt-1 text-xs text-indigo-700">Rights reversions within 90 days.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Emails send only when `RESEND_API_KEY`, `REMINDER_FROM_EMAIL`, and `CRON_SECRET` are configured.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium text-gray-900">Delete account</div>
              <div className="text-sm text-gray-500">Permanently deletes your account, projects, auditions, and billing records.</div>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {confirmDelete ? "Confirm delete" : "Delete account"}
            </Button>
          </div>
          {confirmDelete && (
            <p className="mt-3 text-sm text-red-700">
              This cannot be undone. Press confirm delete once more to remove the account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
