import { MenuItem } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { users as seedUsers, type User, type UserRole } from "../data/user";

const LS_USERS_KEY = "users:v1";

// RTL בגודל רגיל (כמו קודם)
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
    return seedUsers;
  });

  useEffect(() => {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(rows));
  }, [rows]);

  // ------- Search (ID or Name only) -------
  const [q, setQ] = useState("");

  const filteredRows = useMemo(() => {
    const norm = (s: any) => String(s ?? "").toLowerCase();
    const qn = norm(q);
    return rows.filter(
      (u) => norm(u.id).includes(qn) || norm(u.name).includes(qn)
    );
  }, [rows, q]);

  // ------- Dialog (create/edit) -------
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const originalRef = useRef<{ id: string; email: string }>({ id: "", email: "" });

  const [form, setForm] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "student",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenCreate = () => {
    setMode("create");
    setForm({ id: "", name: "", email: "", phone: "", role: "student" });
    originalRef.current = { id: "", email: "" };
    setErrors({});
    setOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setMode("edit");
    setForm({ ...u });
    originalRef.current = { id: u.id, email: u.email.toLowerCase() };
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange =
    (field: keyof User) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = e.target.value;
      if (field === "id") value = value.replace(/\D/g, "").slice(0, 9);
      if (field === "phone") value = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const EMAIL_REGEX = /^[^\s@]+@365\.ono\.ac\.il$/i;
  const ID_REGEX = /^\d{9}$/;
  const PHONE_REGEX = /^\d{10}$/;

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (!form.id.trim()) e.id = "יש להזין תעודת זהות.";
    else if (!ID_REGEX.test(form.id)) e.id = "תעודת זהות חייבת להכיל בדיוק 9 ספרות.";
    else if (
      rows.some(
        (u) => String(u.id) === form.id && (mode === "create" || u.id !== originalRef.current.id)
      )
    )
      e.id = "תעודת זהות כבר קיימת.";

    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "יש להזין שם מלא (לפחות 2 תווים).";

    const email = form.email.trim().toLowerCase();
    if (!email) e.email = "יש להזין אימייל.";
    else if (!EMAIL_REGEX.test(email)) e.email = "must end with 365@ono.ac.il";
    else if (
      rows.some(
        (u) =>
          u.email.toLowerCase() === email &&
          (mode === "create" || u.email.toLowerCase() !== originalRef.current.email)
      )
    )
      e.email = "האימייל כבר קיים.";

    if (!form.phone.trim()) e.phone = "יש להזין מספר טלפון.";
    else if (!PHONE_REGEX.test(form.phone)) e.phone = "מספר טלפון חייב להכיל בדיוק 10 ספרות.";

    if (!form.role) e.role = "יש לבחור תפקיד.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const sanitized: User = {
      id: form.id.trim(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      role: form.role,
    };

    if (mode === "create") {
      setRows((prev) => [sanitized, ...prev]);
    } else {
      setRows((prev) =>
        prev.map((u) => (u.id === originalRef.current.id ? { ...u, ...sanitized } : u))
      );
    }

    setOpen(false);
  }

  function handleDeleteCurrent() {
    if (!confirm(`למחוק את ${form.name}?`)) return;
    setRows((prev) => prev.filter((x) => x.id !== originalRef.current.id));
    setOpen(false);
  }

  return (
    <Box sx={{ p: 2 }} dir="rtl">
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          משתמשים
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          הוספת משתמש
        </Button>
      </Box>

      {/* Search (ID/Name only) */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <TextField
          size="small"
          placeholder="חיפוש: ת״ז / שם"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="users">
          <TableHead>
            <TableRow>
              <TableCell align="right">ת״ז</TableCell>
              <TableCell align="right">שם</TableCell>
              <TableCell align="right">אימייל</TableCell>
              <TableCell align="right">טלפון</TableCell>
              <TableCell align="right">תפקיד</TableCell>
              <TableCell align="left" width={48}>{/* אייקון בלבד */}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell align="right">{u.id}</TableCell>
                <TableCell align="right">{u.name}</TableCell>
                <TableCell align="right">{u.email}</TableCell>
                <TableCell align="right">{u.phone}</TableCell>
                <TableCell align="right">{u.role === "team" ? "מנהל" : "סטודנט"}</TableCell>
                <TableCell align="left">
                  <IconButton size="small" onClick={() => handleOpenEdit(u)} aria-label="עריכה">
                    <EditRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog: Create/Edit User */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{mode === "create" ? "הוספת משתמש" : "עריכת משתמש"}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                required
                label="תעודת זהות"
                value={form.id}
                onChange={handleChange("id")}
                sx={rtlFieldSx}
                inputProps={{ inputMode: "numeric", pattern: "\\d{9}", maxLength: 9 }}
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
                inputProps={{ inputMode: "numeric", pattern: "\\d{10}", maxLength: 10 }}
                error={!!errors.phone}
              />
              <TextField
                select
                required
                label="תפקיד"
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                sx={rtlFieldSx}
                error={!!errors.role}
                helperText={errors.role}
              >
                <MenuItem value="student">סטודנט</MenuItem>
                <MenuItem value="team">מנהל</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>

          {/* כפתורים גדולים וממורכזים בלבד */}
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Stack direction="row" spacing={3} sx={{ mx: "auto" }} alignItems="center" justifyContent="center">
              {mode === "edit" && (
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={handleDeleteCurrent}
                  sx={{ minWidth: 180, py: 1.1, borderRadius: 2 }}
                >
                  מחק
                </Button>
              )}
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{ minWidth: 180, py: 1.1, borderRadius: 2 }}
              >
                שמור
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
