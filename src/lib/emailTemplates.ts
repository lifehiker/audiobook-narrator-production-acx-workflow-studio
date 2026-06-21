export function buildReminderEmailHtml(params: {
  userName: string;
  overdueInvoices: { project: string; invoiceNumber: string; amount: number; daysOverdue: number }[];
  upcomingPayments: { project: string; amount: number; daysUntilDue: number }[];
  upcomingRightsReversions: { project: string; daysUntil: number }[];
}): string {
  const { userName, overdueInvoices, upcomingPayments, upcomingRightsReversions } = params;

  const sections: string[] = [];

  if (overdueInvoices.length > 0) {
    sections.push(`
      <h2 style="color:#dc2626">Overdue Invoices</h2>
      <ul>
        ${overdueInvoices.map(i => `<li><strong>${i.project}</strong> — Invoice ${i.invoiceNumber || "#"}: $${(i.amount / 100).toFixed(2)} — ${i.daysOverdue} days overdue</li>`).join("")}
      </ul>
    `);
  }

  if (upcomingPayments.length > 0) {
    sections.push(`
      <h2 style="color:#d97706">Upcoming Payments</h2>
      <ul>
        ${upcomingPayments.map(p => `<li><strong>${p.project}</strong>: $${(p.amount / 100).toFixed(2)} due in ${p.daysUntilDue} days</li>`).join("")}
      </ul>
    `);
  }

  if (upcomingRightsReversions.length > 0) {
    sections.push(`
      <h2 style="color:#7c3aed">Upcoming Rights Reversion Dates</h2>
      <ul>
        ${upcomingRightsReversions.map(r => `<li><strong>${r.project}</strong>: rights revert in ${r.daysUntil} days</li>`).join("")}
      </ul>
    `);
  }

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h1 style="color:#1e40af">Narrator Workflow Studio Reminders</h1>
      <p>Hi ${userName},</p>
      <p>Here are your reminders for today:</p>
      ${sections.join("")}
      <hr/>
      <p style="font-size:12px;color:#6b7280">
        You can manage your reminder settings in your
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/settings">account settings</a>.
      </p>
    </div>
  `;
}
