type PronunciationRow = {
  term: string;
  phonetic?: string | null;
  category?: string | null;
  source?: string | null;
  notes?: string | null;
  status: string;
};

type PickupRow = {
  chapter?: string | null;
  location?: string | null;
  issueType: string;
  originalText?: string | null;
  correctedText?: string | null;
  notes?: string | null;
  status: string;
};

type AuditionRow = {
  title: string;
  author?: string | null;
  client?: string | null;
  platform: string;
  auditionDate?: Date | null;
  submittedDate?: Date | null;
  rateTerms?: string | null;
  status: string;
  notes?: string | null;
};

type InvoiceRow = {
  invoiceNumber?: string | null;
  amountCents: number;
  sentDate?: Date | null;
  dueDate?: Date | null;
  paidDate?: Date | null;
  status: string;
};

function escape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = val instanceof Date ? val.toISOString().split("T")[0] : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) => row.map(escape).join(","));
  return [headerLine, ...dataLines].join("\n");
}

export function pronunciationsToCsv(entries: PronunciationRow[]): string {
  return toCsv(
    ["Term", "Phonetic", "Category", "Source", "Notes", "Status"],
    entries.map((e) => [e.term, e.phonetic, e.category, e.source, e.notes, e.status])
  );
}

export function pickupsToCsv(entries: PickupRow[]): string {
  return toCsv(
    ["Chapter", "Location", "Issue Type", "Original Text", "Corrected Text", "Notes", "Status"],
    entries.map((e) => [e.chapter, e.location, e.issueType, e.originalText, e.correctedText, e.notes, e.status])
  );
}

export function auditionsToCsv(entries: AuditionRow[]): string {
  return toCsv(
    ["Title", "Author", "Client", "Platform", "Audition Date", "Submitted Date", "Rate/Terms", "Status", "Notes"],
    entries.map((e) => [e.title, e.author, e.client, e.platform, e.auditionDate, e.submittedDate, e.rateTerms, e.status, e.notes])
  );
}

export function invoicesToCsv(entries: InvoiceRow[]): string {
  return toCsv(
    ["Invoice #", "Amount ($)", "Sent Date", "Due Date", "Paid Date", "Status"],
    entries.map((e) => [e.invoiceNumber, (e.amountCents / 100).toFixed(2), e.sentDate, e.dueDate, e.paidDate, e.status])
  );
}
