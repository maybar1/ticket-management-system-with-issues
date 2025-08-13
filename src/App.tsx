import Header from './components/Header';
import Footer from './components/Footer';
import TicketsTable from './components/TicketsTable';
import UsersTable from './components/UsersTable';
import { tickets } from './data/tickets';

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <Header />

      <h2 style={{ margin: '16px 0' }}>Users</h2>
      <UsersTable />

      <h2 style={{ margin: '16px 0' }}>Tickets</h2>
      <TicketsTable rows={tickets} />

      <Footer />
    </div>
  );
}
