// src/components/UsersPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { users as seedUsers, type User } from "../data/user";

const LS_USERS_KEY = "users:v1";

const rtlFieldSx = {
  "& .MuiInputBase-input": { textAlign: "right" },
  "& .MuiInputLabel-root": {
    right: 14,
    left: "auto",
    transformOrigin: "top right",
  },
};

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>(() => {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr as User[];
      } catch {}
    }
    return seedUsers; // טעינה/זריעה ראשונית
  });

  useEffect(() => {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(rows));
  }, [rows]);

  // ---------- Add User Dialog ----------
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpen = () => {
    setForm({ id: "", name: "", email: "", phone: "" });
    setErrors({});
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange =
    (field: keyof User) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = e.target.value;
      if (field === "id") value = value.replace(/\D/g, "").slice(0, 9); // ת"ז: ספרות בלבד, עד 9
      if (field === "phone") value = value.replace(/\D/g, "").slice(0, 10); // טל': ספרות בלבד, עד 10
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const EMAIL_REGEX = /^[^\s@]+@365\.ono\.ac\.il$/i;
  const ID_REGEX = /^\d{9}$/; // בדיוק 9 ספרות
  const PHONE_REGEX = /^\d{10}$/; // בדיוק 10 ספרות

  function validate(): boolean {
    const e: Record<string, string> = {};

    // ת"ז
    if (!form.id.trim()) e.id = "יש להזין תעודת זהות.";
    else if (!ID_REGEX.test(form.id))
      e.id = "תעודת זהות חייבת להכיל בדיוק 9 ספרות.";
    else if (rows.some((u) => String(u.id) === form.id))
      e.id = "תעודת זהות כבר קיימת.";

    // שם
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "יש להזין שם מלא (לפחות 2 תווים).";

    // אימייל

    const email = form.email.trim().toLowerCase();
    if (!email) e.email = "יש להזין אימייל.";
    else if (!EMAIL_REGEX.test(email))
      e.email = "must end with 365@ono.ac.il"
    else if (rows.some((u) => u.email === email))
      e.email = "האימייל כבר קיים.";

    // טלפון
    if (!form.phone.trim()) e.phone = "יש להזין מספר טלפון.";
    else if (!PHONE_REGEX.test(form.phone))
      e.phone = "מספר טלפון חייב להכיל בדיוק 10 ספרות.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newUser: User = {
      id: form.id.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    setRows((prev) => [newUser, ...prev]); 
    setOpen(false);
  }

  return (
    <Box sx={{ p: 2 }} dir="rtl">
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          משתמשים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          הוספת משתמש
        </Button>
      </Box>

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
            {rows.map((u) => (
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

      {/* Dialog: Add User */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>הוספת משתמש</DialogTitle>
        <Box component="form" onSubmit={handleAddUser}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                required
                label="תעודת זהות"
                value={form.id}
                onChange={handleChange("id")}
                sx={rtlFieldSx}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "\\d{9}",
                  maxLength: 9,
                }}
                error={!!errors.id}
                helperText={errors.id || "ספרות בלבד "}
              />
              <TextField
                required
                label="שם מלא"
                value={form.name}
                onChange={handleChange("name")}
                sx={rtlFieldSx}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                required
                label="אימייל"
                value={form.email}
                onChange={handleChange("email")}
                sx={rtlFieldSx}
                placeholder="name@365.ono.ac.il"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                required
                label="טלפון"
                value={form.phone}
                onChange={handleChange("phone")}
                sx={rtlFieldSx}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "\\d{10}",
                  maxLength: 10,
                }}
                error={!!errors.phone}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose}>בטל</Button>
            <Button type="submit" variant="contained">
              שמור
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
