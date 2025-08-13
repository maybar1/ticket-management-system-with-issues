export type TicketStatus = "פתוח" | "בטיפול" | "סגור";

export default class Ticket {
  id: number;
  subject: string;
  description: string;
  studentId: string;
  date: string; // dd/mm/yyyy
  status: TicketStatus;

  constructor(
    id: number,
    subject: string,
    description: string,
    studentId: string,
    date: string,
    status: TicketStatus
  ) {
    this.id = id;
    this.subject = subject;
    this.description = description;
    this.studentId = studentId;
    this.date = date;
    this.status = status;
  }

  static from(obj: any): Ticket {
    return new Ticket(
      Number(obj.id),
      String(obj.subject),
      String(obj.description),
      String(obj.studentId),
      String(obj.date),
      obj.status as TicketStatus
    );
  }

  //creating random ticket
  static random(nextId = Math.floor(Math.random() * 900) + 100): Ticket {
    const subjects = [
      "בעיה במערכת שעות",
      "שאלה כללית",
      "עדכון סטטוס",
      "בקשה לקורס חדש",
      "לוח מבחנים",
      "בעיה בתשלומים",
      "גישה לחומרי קורס",
    ];
    const descriptions = [
      "קורסים חופפים בזמנים",
      "איפה אני יכול למצוא את הציונים?",
      "אנא סגור את הכרטיס שלי",
      "בקשה לקורס חדש על בינה מלאכותית",
      "מתי יפורסם לוח המבחנים?",
      "פריסת תשלומים",
      "לא מצליח לגשת לחומרי הקורס עבור CS101",
    ];
    const statuses: TicketStatus[] = ["פתוח", "בטיפול", "סגור"];

    const subject = pick(subjects);
    const description = pick(descriptions);
    const status = pick(statuses);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const date = `${dd}/${mm}/${yyyy}`;

    const studentId = String(
      Math.floor(Math.random() * 900_000_000) + 100_000_000
    );

    return new Ticket(nextId, subject, description, studentId, date, status);
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
