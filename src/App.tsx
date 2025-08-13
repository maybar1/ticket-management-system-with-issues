import Header from './components/Header';
import Footer from './components/Footer';
import TicketsTable from './components/TicketsTable';
import { tickets as seedTickets } from './data/tickets';
import Ticket from './models/Ticket';
import { useEffect, useState } from 'react';

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
      <h2 style={{ margin: '16px 0' }}>Tickets</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={addRandom}>➕ הוסף פנייה אקראית</button>
        <button onClick={saveToLocalStorage}>Save to localStorage</button>

      </div>

      <TicketsTable rows={tickets} />
      <Footer />
    </div>
  );
}
