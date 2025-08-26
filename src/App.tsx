import Header, { type Role } from './components/Header';
import Footer from './components/Footer';
import TicketsTable from './components/TicketsTable';
import { tickets as seedTickets } from './data/tickets';
import Ticket from './models/Ticket';
import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NewTicket from './components/NewTicket';
import Help from './components/Help';
import ChatPage from './components/ChatPage';


const LS_KEY = 'tickets:v1';
const CURRENT_STUDENT_ID = '123456789';


export default function App() {
  const [role, setRole] = useState<Role>('student');

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(Ticket.from);
      } catch {}
    }
    return seedTickets.map(Ticket.from);
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tickets));
  }, [tickets]);

  //add a new random Ticket to the beginning of the list.
  function addRandom() {
    const nextId = tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 101;
    setTickets(prev => [Ticket.random(nextId), ...prev]);
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

  
        <Route path="/help" element={<Help />} />
      </Routes>

      <Footer />
    </div>
  );
}