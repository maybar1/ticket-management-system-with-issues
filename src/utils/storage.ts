// src/utils/storage.ts

export type Attachment = {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64
};

export type Ticket = {
  id: string; 
  subject: string;
  description: string;
  studentId: string;
  date: string; // DD/MM/YYYY
  status: "פתוח" | "בטיפול" | "סגור"; 
  phone?: string;
  priority: "רגילה" | "גבוהה" | "דחופה";
  department: string;
  attachments?: Attachment[];
};

const LS_KEY = "tickets";

export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Ticket[]) : [];
  } catch {
    return [];
  }
}

export function saveTickets(tickets: Ticket[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(tickets));
}

export function addTicket(ticket: Ticket) {
  const all = loadTickets();
  all.push(ticket);
  saveTickets(all);
}

export function updateTicketStatus(
  id: string | number,
  status: "פתוח" | "בטיפול" | "סגור"
) {
  const target = String(id);
  const all = loadTickets();
  const idx = all.findIndex(t => String(t.id) === target);
  if (idx !== -1) {
    all[idx] = { ...all[idx], status };
    saveTickets(all);
  }
  return all;
}
export function nextIdFrom(list: Ticket[], start = 101): string {
  const max = list.length ? Math.max(...list.map(t => Number(t.id) || 0)) : start - 1;
  return String(max + 1);
}
