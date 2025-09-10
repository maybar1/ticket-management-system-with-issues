import { useEffect, useState } from "react";
import type Ticket from "../models/Ticket";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip, Select, MenuItem } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { updateTicketStatus } from "../utils/storage";

export default function TicketsTable({ rows }: { rows: Ticket[] }) {
  const navigate = useNavigate();

  // מי מחובר? נשמר ע"י Header: 'student' או 'agent'
  const role = (localStorage.getItem("role") as "student" | "agent") || "student";

  // עותק מקומי כדי לעדכן UI מיידית
  const [data, setData] = useState<Ticket[]>(rows);
  useEffect(() => setData(rows), [rows]);

  const handleStatusChange = (id: string | number, status: "פתוח" | "בטיפול" | "סגור") => {
    const target = String(id);
    // עדכון תצוגה מיידי (השוואה כמחרוזת כדי לכסות id כמספר/מחרוזת)
    setData(prev => prev.map(t => (String(t.id) === target ? { ...t, status } : t)));
    // שמירה ל-localStorage
    updateTicketStatus(id, status);
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["#", "נושא", "תיאור", "סטודנט", "תאריך", "סטטוס", "שיחה"].map(h => (
            <th
              key={h}
              style={{ borderBottom: "1px solid #ddd", textAlign: "start", padding: "8px" }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(r => (
          <tr key={String(r.id)}>
            <td style={{ padding: "8px" }}>{r.id}</td>
            <td style={{ padding: "8px" }}>{r.subject}</td>
            <td style={{ padding: "8px" }}>{r.description}</td>
            <td style={{ padding: "8px" }}>{r.studentId}</td>
            <td style={{ padding: "8px" }}>{r.date}</td>

            {/* סטטוס: מנהל יכול לערוך; סטודנט רואה טקסט */}
            <td style={{ padding: "8px" }}>
              {role === "agent" ? (
                <Select
                  size="small"
                  value={r.status ?? "פתוח"}
                  onChange={(e) => handleStatusChange(r.id as any, e.target.value as any)}
                >
                  <MenuItem value="פתוח">פתוח</MenuItem>
                  <MenuItem value="בטיפול">בטיפול</MenuItem>
                  <MenuItem value="סגור">סגור</MenuItem>
                </Select>
              ) : (
                r.status
              )}
            </td>

            {/* עמודת "שיחה" עם אייקון */}
            <td style={{ padding: "8px", textAlign: "center" }}>
              <Tooltip title="צפייה בשיחה">
                <IconButton color="primary" onClick={() => navigate("/tickets/" + r.id)}>
                  <ChatIcon />
                </IconButton>
              </Tooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}