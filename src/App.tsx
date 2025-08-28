import Header, { type Role } from './components/Header';
import Footer from './components/Footer';
import TicketsTable from './components/TicketsTable';
import { tickets as seedTickets } from './data/tickets';
import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NewTicket from './components/NewTicket';
import Help from './components/Help';
import ChatPage from './components/ChatPage';
import { type Ticket, loadTickets, saveTickets, nextIdFrom } from './utils/storage';
import UsersPage from "./components/UsersPage";
import SubmissionSuccess from "./components/SubmissionSuccess"; 



const LS_KEY = 'tickets';
const CURRENT_STUDENT_ID = '123456789';


export default function App() {
  const [role, setRole] = useState<Role>('student');

  const [tickets, setTickets] = useState<Ticket[]>(() => {
  const ls = loadTickets();
  return ls.length ? ls : (seedTickets as Ticket[]); 
});


  useEffect(() => {
  if (tickets.length < 10) {
    const base = tickets.length ? Math.max(...tickets.map(t => Number(t.id) || 100)) : 100;
    const extras: Ticket[] = Array.from({ length: 10 - tickets.length }, (_, i) => ({
      id: String(base + 1 + i),
      subject: 'שאלה כללית',
      description: 'פניית דוגמה',
      studentId: '123456789',
      date: new Date().toLocaleDateString('he-IL'),
      status: 'פתוח',
      priority: 'רגילה',
      department: 'מנהל סטודנטים',
      attachments: []
    }));
    const seeded = [...tickets, ...extras];
    setTickets(seeded);
    saveTickets(seeded);
  }
}, []);

    useEffect(() => { saveTickets(tickets); }, [tickets]);



  //add a new random Ticket to the beginning of the list.
  function addRandom() {
  const newOne: Ticket = {
    id: nextIdFrom(tickets),
    subject: 'שאלה כללית',
    description: 'תיאור לדוגמה',
    studentId: '123456789',
    date: new Date().toLocaleDateString('he-IL'),
    status: 'פתוח',
    priority: 'רגילה',
    department: 'מנהל סטודנטים',
    attachments: []
  };
  setTickets(prev => [newOne, ...prev]);
}


  // Function for the button click
  function saveToLocalStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(tickets));
  console.log('Saved to localStorage manually');
  alert('Saved to localStorage');
}

 const myTickets = useMemo(
    () =>
      tickets.filter((t: any) =>
        typeof t?.studentId === 'string' ? t.studentId === CURRENT_STUDENT_ID : true
      ),
    [tickets]
  );

 return (
  <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, direction: 'rtl' }}>
    <Header role={role} onRoleChange={setRole} />

    <Routes>
      <Route
        path="/"
        element={
          <>
            <h2 style={{ margin: '16px 0' }}>Tickets</h2>
           
            {role === 'team' && (
             <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button onClick={addRandom}>➕ הוסף פניה אקראית</button>
                  <button onClick={saveToLocalStorage}>Save to localStorage</button>
                </div>
              )}

              <TicketsTable rows={tickets} />
            </>
          }
        />

       {/* פניות (מנהל/צוות) */}
        <Route path="/tickets" element={<TicketsTable rows={tickets} />} />

        {/* הפניות שלי (סטודנט) */}
        <Route path="/my" element={<TicketsTable rows={myTickets} />} />

        {/* פנייה חדשה (סטודנט) */}
        <Route path="/NewTicket" element={<NewTicket />} />
        <Route path="/tickets/:id" element={<ChatPage />} />

        {/* ✅ מסך אישור שליחה */}
        <Route path="/submitted/:id" element={<SubmissionSuccess />} />
  
        <Route path="/help" element={<Help />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>

      <Footer />
    </div>
  );
}
