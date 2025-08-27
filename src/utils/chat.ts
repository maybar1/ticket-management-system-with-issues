// src/utils/chat.ts
export type ChatMessage = {
  id: string;
  ticketId: string;
  sender: "student" | "agent";
  text: string;
  ts: number;
  senderName?: string; // אופציונלי
};

const KEY = "ticket_chats";

function readAll(): Record<string, ChatMessage[]> {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeAll(db: Record<string, ChatMessage[]>) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function loadChat(ticketId: string): ChatMessage[] {
  const db = readAll();
  return db[String(ticketId)] ?? [];
}

export function addMessage(
  ticketId: string,
  msg: Omit<ChatMessage, "id" | "ts" | "ticketId">
) {
  const db = readAll();
  const arr = db[String(ticketId)] ?? [];
  const newMsg: ChatMessage = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
    ticketId,
    ts: Date.now(),
    ...msg,
  };
  arr.push(newMsg);
  db[String(ticketId)] = arr;
  writeAll(db);
  return newMsg;
}

// --- helpers to seed first message from the ticket ---
function parseDDMMYYYY(dateStr?: string): number {
  // קלט צפוי: DD/MM/YYYY. אם לא תקין -> עכשיו
  if (!dateStr) return Date.now();
  const parts = dateStr.split("/");
  if (parts.length !== 3) return Date.now();
  const [dd, mm, yyyy] = parts.map(Number);
  const dt = new Date(yyyy || 0, (mm || 1) - 1, dd || 1, 9, 0, 0);
  return isNaN(dt.getTime()) ? Date.now() : dt.getTime();
}

/**
 * זורע הודעת פתיחה מתוך פרטי הפנייה, אם אין עדיין שיחה לפנייה הזו.
 * מחזיר את רשימת ההודעות לאחר הזריעה/ללא שינוי אם כבר קיימות הודעות.
 */
export function seedChatFromTicketIfEmpty(
  ticketId: string,
  ticket: { subject: string; description: string; date?: string },
  studentName = "איילת"
) {
  const db = readAll();
  const key = String(ticketId);
  const existing = db[key] ?? [];
  if (existing.length > 0) return existing;

  const firstText = `פנייה חדשה: ${ticket.subject}\n${ticket.description}`;
  const ts = parseDDMMYYYY(ticket.date);

  const seeded: ChatMessage = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random()),
    ticketId: String(ticketId),
    sender: "student",
    senderName: studentName,
    text: firstText,
    ts,
  };

  db[key] = [seeded];
  writeAll(db);
  return db[key];
}
