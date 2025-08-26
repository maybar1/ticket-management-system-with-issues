import type Ticket from '../models/Ticket';
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

export default function TicketsTable({ rows }: { rows: Ticket[] }) {
  const navigate = useNavigate();

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['#','נושא','תיאור','סטודנט','תאריך','סטטוס','שיחה'].map(h => (
            <th
              key={h}
              style={{ borderBottom:'1px solid #ddd', textAlign:'start', padding:'8px' }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td style={{padding:'8px'}}>{r.id}</td>
            <td style={{padding:'8px'}}>{r.subject}</td>
            <td style={{padding:'8px'}}>{r.description}</td>
            <td style={{padding:'8px'}}>{r.studentId}</td>
            <td style={{padding:'8px'}}>{r.date}</td>
            <td style={{padding:'8px'}}>{r.status}</td>

            {/* עמודת "שיחה" עם אייקון */}
            <td style={{padding:'8px', textAlign:'center'}}>
              <Tooltip title="צפייה בשיחה">
                <IconButton
                  color="primary"
                  onClick={() => navigate('/tickets/' + r.id)}
                >
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
