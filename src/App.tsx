import Header from './components/Header';
import Footer from './components/Footer';
import TicketsTable from './components/TicketsTable';
import { tickets as seedTickets } from './data/tickets';
import Ticket from './models/Ticket';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Forms from './components/Forms.tsx';
import Management from './components/Management.tsx';
import Help from './components/Help.tsx';


const LS_KEY = 'tickets:v1';

export default function App() {
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


 return (
  <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, direction: 'rtl' }}>
    <Header />

    <Routes>
      {/* דף הבית - Tickets */}
      <Route
        path="/"
        element={
          <>
            <h2 style={{ margin: '16px 0' }}>Tickets</h2>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={addRandom}>➕ הוסף פניה אקראית</button>
              <button onClick={saveToLocalStorage}>Save to localStorage</button>
            </div>

            <TicketsTable rows={tickets} />
          </>
        }
      />

      {/* עמודים נוספים */}
      <Route path="/forms" element={<Forms />} />
      <Route path="/management" element={<Management />} />
      <Route path="/help" element={<Help />} />
      
    </Routes>

    <Footer />
  </div>
);


}
