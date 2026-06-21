import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildReminderEmailHtml } from "@/lib/emailTemplates";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const users = await db.user.findMany({
    include: {
      subscription: true,
      projects: {
        include: { invoices: true },
        where: { status: { not: "ARCHIVED" } },
      },
    },
  });

  let sent = 0;

  for (const user of users) {
    const overdueInvoices: { project: string; invoiceNumber: string; amount: number; daysOverdue: number }[] = [];
    const upcomingPayments: { project: string; amount: number; daysUntilDue: number }[] = [];
    const upcomingRightsReversions: { project: string; daysUntil: number }[] = [];

    for (const project of user.projects) {
      for (const inv of project.invoices) {
        if (inv.dueDate && inv.status !== "PAID") {
          const diff = Math.floor((now.getTime() - inv.dueDate.getTime()) / 86400000);
          if (diff > 0) {
            const key = `overdue_invoice_${inv.id}_${inv.dueDate.toISOString().split("T")[0]}`;
            const alreadySent = await db.reminderLog.findFirst({ where: { userId: user.id, eventType: "overdue_invoice", eventDate: key } });
            if (!alreadySent) {
              overdueInvoices.push({ project: project.title, invoiceNumber: inv.invoiceNumber ?? "", amount: inv.amountCents, daysOverdue: diff });
              await db.reminderLog.create({ data: { userId: user.id, eventType: "overdue_invoice", eventDate: key } });
            }
          } else if (diff > -7) {
            upcomingPayments.push({ project: project.title, amount: inv.amountCents, daysUntilDue: Math.abs(diff) });
          }
        }
      }
      if (project.rightsReversionDate) {
        const diffDays = Math.floor((project.rightsReversionDate.getTime() - now.getTime()) / 86400000);
        if (diffDays >= 0 && diffDays <= 90) {
          upcomingRightsReversions.push({ project: project.title, daysUntil: diffDays });
        }
      }
    }

    if (overdueInvoices.length === 0 && upcomingPayments.length === 0 && upcomingRightsReversions.length === 0) continue;

    if (!process.env.RESEND_API_KEY) {
      console.log("[reminders] RESEND_API_KEY not set, skipping email for", user.email);
      continue;
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.REMINDER_FROM_EMAIL ?? "reminders@narratorworkflow.com",
      to: user.email,
      subject: "Narrator Workflow Studio — Your Daily Reminders",
      html: buildReminderEmailHtml({
        userName: user.name ?? user.email,
        overdueInvoices,
        upcomingPayments,
        upcomingRightsReversions,
      }),
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
