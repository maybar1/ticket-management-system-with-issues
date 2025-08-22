// src/utils/storage.ts

export type Attachment = {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64
};

export type Ticket = {
  id: string; // נשמר כמחרוזת
  subject: string;
  description: string;
  studentId: string; // ת"ז
  date: string;      // DD/MM/YYYY
  status: "פתוח" | "בטיפול" | "נסגר";
  priority: "רגילה" | "גבוהה" | "דחופה";
  department: string;
  attachments?: Attachment[];
};

const LS_KEY = "tickets";

// קריאה מה-LocalStorage באופן בטוח
export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // הגנה בסיסית מטיפוסים לא תקינים
    return Array.isArray(parsed) ? (parsed as Ticket[]) : [];
  } catch {
    return [];
  }
}

// שמירה בטוחה
export function saveTickets(tickets: Ticket[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(tickets));
}

// הוספה
export function addTicket(ticket: Ticket) {
  const all = loadTickets();
  all.push(ticket);
  saveTickets(all);
}
