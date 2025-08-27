import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer
} from "@mui/material";
import { users as seedUsers, type User } from "../data/user";

const LS_USERS_KEY = "users:v1";

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>(() => {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (raw) {
      try { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr as User[]; } catch {}
    }
    return seedUsers; // טעינה ראשונית
  });

  useEffect(() => {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(rows));
  }, [rows]);

  return (
    <Box sx={{ p: 2 }} dir="rtl">
      <Typography variant="h5" gutterBottom>משתמשים</Typography>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="users">
          <TableHead>
            <TableRow>
              <TableCell align="right">ת״ז</TableCell>
              <TableCell align="right">שם</TableCell>
              <TableCell align="right">אימייל</TableCell>
              <TableCell align="right">טלפון</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(u => (
              <TableRow key={u.id} hover>
                <TableCell align="right">{u.id}</TableCell>
                <TableCell align="right">{u.name}</TableCell>
                <TableCell align="right">{u.email}</TableCell>
                <TableCell align="right">{u.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
