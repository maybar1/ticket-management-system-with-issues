import Header, { type Role } from "./components/Header";
import Footer from "./components/Footer";
import TicketsTable from "./components/TicketsTable";
import { tickets as seedTickets } from "./data/tickets";
import { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NewTicket from "./components/NewTicket";
import Help from "./components/Help";
import ChatPage from "./components/ChatPage";
import {
  type Ticket,
  loadTickets,
  saveTickets,
  nextIdFrom,
} from "./utils/storage";
import UsersPage from "./components/UsersPage";
import SubmissionSuccess from "./components/SubmissionSuccess";
import TicketModel from "./models/Ticket";

const CURRENT_STUDENT_ID = "123456789";

export default function App() {
  const [role, setRole] = useState<Role>("student");

  const initialFromLS = loadTickets();
  const wasEmptyRef = useRef<boolean>(initialFromLS.length === 0);

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    return initialFromLS.length ? initialFromLS : (seedTickets as Ticket[]);
  });

  useEffect(() => {
    if (!wasEmptyRef.current) return;

    if (tickets.length < 10) {
      const base = tickets.length
        ? Math.max(...tickets.map((t) => Number(t.id) || 100))
        : 100;
      const extras: Ticket[] = Array.from(
        { length: 10 - tickets.length },
        (_, i) => ({
          id: String(base + 1 + i),
          subject: "שאלה כללית",
          description: "פניית דוגמה",
          studentId: "123456789",
          date: new Date().toLocaleDateString("he-IL"),
          status: "פתוח",
          priority: "רגילה",
          department: "מנהל סטודנטים",
          attachments: [],
        })
      );
      const seeded = [...tickets, ...extras];
      setTickets(seeded);
    }
  }, []);

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  //add a new random Ticket to the beginning of the list.
  function addRandom() {
    const nextId = nextIdFrom(tickets);
    const r = TicketModel.random(Number(nextId));
    const newOne: Ticket = {
      id: String(r.id),
      subject: r.subject,
      description: r.description,
      studentId: r.studentId,
      date: r.date,
      status: r.status,
      priority: "רגילה",
      department: "מנהל סטודנטים",
      attachments: [],
    };
    setTickets((prev) => [newOne, ...prev]);
  }

  // Function for the button click
  function saveToLocalStorage() {
    saveTickets(tickets);
    console.log("Saved to localStorage manually");
    alert("Saved to localStorage");
  }

  const myTickets = useMemo(
    () =>
      tickets.filter((t: any) =>
        typeof t?.studentId === "string"
          ? t.studentId === CURRENT_STUDENT_ID
          : true
      ),
    [tickets]
  );

  return (
    <div
      style={{ maxWidth: 960, margin: "0 auto", padding: 16, direction: "rtl" }}
    >
      <Header role={role} onRoleChange={setRole} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h2 style={{ margin: "16px 0" }}>Tickets</h2>

              {role === "team" && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <button onClick={addRandom}>➕ הוסף פניה אקראית</button>
                  <button onClick={saveToLocalStorage}>
                    Save to localStorage
                  </button>
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
