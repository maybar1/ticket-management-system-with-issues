import type Ticket from '../models/Ticket';

export default function TicketsTable({ rows }: { rows: Ticket[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['#','נושא','תיאור','סטודנט','תאריך','סטטוס'].map(h => (
            <th key={h} style={{borderBottom:'1px solid #ddd', textAlign:'start', padding:'8px'}}>{h}</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
