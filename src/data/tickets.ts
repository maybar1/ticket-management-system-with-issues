export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  studentId: string;
  date: string; // dd/mm/yyyy
  status: TicketStatus;
}

export const tickets: Ticket[] = [
  { id: 101, subject: 'Schedule issue', description: 'Conflict between courses', studentId: '123456789', date: '08/08/2025', status: 'Open' },
  { id: 102, subject: 'General question', description: 'Where do I find grades?', studentId: '987654321', date: '08/08/2025', status: 'In Progress' },
  { id: 103, subject: 'Status update', description: 'Please close my ticket', studentId: '123123123', date: '08/08/2025', status: 'Closed' },
  { id: 104, subject: 'New course request', description: 'Request for new course on AI', studentId: '456456456', date: '08/08/2025', status: 'Open' },
  { id: 105, subject: 'Exam schedule', description: 'When will the exam schedule be released?', studentId: '789789789', date: '08/08/2025', status: 'In Progress' },
  { id: 106, subject: 'Course material access', description: 'Unable to access course materials for CS101', studentId: '321321321', date: '08/08/2025', status: 'Open' },
];
