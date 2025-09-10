import { useEffect, useState } from "react";
import type Ticket from "../models/Ticket";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip, Select, MenuItem } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { updateTicketStatus } from "../utils/storage";

//  קומפוננטה לא ב-PascalCase
export default function ticketstable({ rows }: { rows: Ticket[] }) {
  const navigate = useNavigate();

  // מי מחובר? נשמר ע"י Header: 'student' או 'agent'
  const role = (localStorage.getItem("role") as "student" | "agent") || "student";

  // עותק מקומי כדי לעדכן UI מיידית
  const [data, setData] = useState<Ticket[]>(rows);
  useEffect(() => setData(rows), [rows]);

  //  שם הפונקציה לא ב-camelCase
  const Handle_status_change = (id: string | number, status: "פתוח" | "בטיפול" | "סגור") => {
    const target = String(id);
    setData(prev => prev.map(t => (String(t.id) === target ? { ...t, status } : t)));
    updateTicketStatus(id, status);
  };

  return (
    //  className לא ב-lowercase-hyphen
    <table className="TicketsTable" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["#", "נושא", "תיאור", "סטודנט", "תאריך", "סטטוס", "שיחה"].map(h => (
            <th
              key={h}
              className="TableHeader" //  className לא ב-lowercase-hyphen
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
                  onChange={(e) => Handle_status_change(r.id as any, e.target.value as any)}
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
                {/*  מרכאות לא עקביות */}
                <IconButton color='primary' onClick={() => navigate("/tickets/" + r.id)}>
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
