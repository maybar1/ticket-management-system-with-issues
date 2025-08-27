import type { Ticket } from "../utils/storage";


export const tickets: Ticket[] = [
  { id: "101", subject: "בעיה במערכת שעות", description: "קורסים חופפים בזמנים", studentId: "123456789", date: "08/08/2025", status: "פתוח",  priority: "רגילה", department: "מנהל סטודנטים", attachments: [] },
  { id: "102", subject: "שאלה כללית",       description: "איפה אני יכול למצוא את הציונים?", studentId: "987654321", date: "08/08/2025", status: "בטיפול", priority: "רגילה", department: "ספריה", attachments: [] },
  { id: "103", subject: "עדכון סטטוס",      description: "אנא סגור את הכרטיס שלי", studentId: "123123123", date: "08/08/2025", status: "סגור",  priority: "רגילה", department: "דיקנט הסטודנטים", attachments: [] },
  { id: "104", subject: "בקשה לקורס חדש",   description: "בינה מלאכותית", studentId: "456456456", date: "08/08/2025", status: "פתוח",  priority: "רגילה", department: "יחידה ללימודי תעודה", attachments: [] },
  { id: "105", subject: "לוח מבחנים",       description: "מתי יפורסם?", studentId: "789789789", date: "08/08/2025", status: "בטיפול", priority: "רגילה", department: "מדור אנגלית", attachments: [] },
  { id: "106", subject: "גישה לחומרי קורס", description: "CS101 לא נפתח", studentId: "321321321", date: "08/08/2025", status: "פתוח",  priority: "רגילה", department: "מרכז קריירה", attachments: [] },
  { id: "107", subject: "בעיה בתשלומים",    description: "פריסת תשלומים", studentId: "222333444", date: "08/08/2025", status: "פתוח",  priority: "רגילה", department: "מדור שכר לימוד", attachments: [] },
  { id: "108", subject: "מערכת שעות",       description: "חפיפה בין קורסי ליבה", studentId: "123456789", date: "08/08/2025", status: "פתוח", priority: "רגילה", department: "מנהל סטודנטים", attachments: [] },
  { id: "109", subject: "ספרים חסרים",      description: "לא נמצא ספר חובה", studentId: "555666777", date: "08/08/2025", status: "פתוח", priority: "רגילה", department: "ספריה", attachments: [] },
  { id: "110", subject: "תמיכה טכנית",      description: "בעיה בהתחברות", studentId: "888999000", date: "08/08/2025", status: "פתוח", priority: "רגילה", department: "קליניקות", attachments: [] },
];
