export type TicketStatus = 'פתוח' | 'בטיפול' | 'סגור';

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  studentId: string;
  date: string; // dd/mm/yyyy
  status: TicketStatus;
}

export const tickets: Ticket[] = [
  { id: 101, subject: 'בעיה במערכת שעות', description: 'קורסים חופפים בזמנים', studentId: '123456789', date: '08/08/2025', status: 'פתוח' },
  { id: 102, subject: 'שאלה כללית', description: 'איפה אני יכול למצוא את הציונים?', studentId: '987654321', date: '08/08/2025', status: 'בטיפול' },
  { id: 103, subject: 'עדכון סטטוס', description: 'אנא סגור את הכרטיס שלי', studentId: '123123123', date: '08/08/2025', status: 'סגור' },
  { id: 104, subject: 'בקשה לקורס חדש', description: 'בקשה לקורס חדש על בינה מלאכותית', studentId: '456456456', date: '08/08/2025', status: 'פתוח' },
  { id: 105, subject: 'לוח מבחנים', description: 'מתי יפורסם לוח המבחנים?', studentId: '789789789', date: '08/08/2025', status: 'בטיפול' },
  { id: 106, subject: 'גישה לחומרי קורס', description: 'לא מצליח לגשת לחומרי הקורס עבור CS101', studentId: '321321321', date: '08/08/2025', status: 'פתוח' },
];
