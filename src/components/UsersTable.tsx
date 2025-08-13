import React, { useState } from 'react';
import { User, users } from '../data/user';


export default function UsersTable() {
  
  const [userList, setUserList] = useState<User[]>(users);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['מזהה', 'שם', 'אימייל', 'טלפון'].map((header, idx) => (
            <th
              key={idx}
              style={{
                borderBottom: '1px solid #ddd',
                textAlign: 'start',
                padding: '8px',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {userList.map((u) => (
          <tr key={u.id}>
            <td style={{ padding: '8px' }}>{u.id}</td>
            <td style={{ padding: '8px' }}>{u.name}</td>
            <td style={{ padding: '8px' }}>{u.email}</td>
            <td style={{ padding: '8px' }}>{u.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
