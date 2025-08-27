// src/components/NewTicket.tsx
import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  addTicket,
  loadTickets,
  type Ticket,
  type Attachment,
} from "../utils/storage";

// 🔹 הגדרות RTL לשדות + העברת האייקון של ה-Select לשמאל
const rtlFieldSx = {
  "& .MuiInputBase-input": { textAlign: "right" }, // input רגיל
  "& .MuiSelect-select": { textAlign: "right" }, // select
  "& .MuiSelect-icon": { left: 8, right: "auto" }, // החץ לשמאל
  "& textarea": { textAlign: "right" }, // multiline
  "& .MuiInputLabel-root": {
    right: 14,
    left: "auto",
    transformOrigin: "top right",
  },
};

const DEPARTMENTS = [
  "מנהל סטודנטים",
  "מדור שכר לימוד",
  "ספריה",
  "מרכז קריירה",
  "מדור אנגלית",
  "דיקנט הסטודנטים",
  "יחידה ללימודי תעודה",
  "קליניקות",
] as const;

type FormData = {
  department: string;
  studentId: string;
  phone: string;
  subject: string;
  description: string;
};

function formatDate(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function readFileAsDataURL(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: String(reader.result || ""),
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ID_REGEX = /^\d{9}$/; // id with length of 9
const PHONE_DIGITS = /^\d{10}$/;

function isValidPhone(raw: string) {
  return PHONE_DIGITS.test(raw);
}

export default function NewTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    department: "",
    studentId: "",
    phone: "",
    subject: "",
    description: "",
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const list = await Promise.all(Array.from(files).map(readFileAsDataURL));
    setAttachments(list);
  };

  function validate(): boolean {
    const e: Record<string, string> = {};

    // ולידציה
    if (!formData.department) e.department = "יש לבחור מחלקה.";
    const id = formData.studentId.trim();
    if (!id) e.studentId = "יש להזין תעודת זהות.";
    else if (!ID_REGEX.test(id))
      e.studentId = "תעודת זהות חייבת להכיל 9 ספרות.";

    if (!formData.subject) e.subject = "יש לבחור נושא פנייה.";
    if ((formData.description || "").trim().length < 2)
      e.description = "יש להזין תיאור קצר.";

    if (formData.phone && !isValidPhone(formData.phone))
      e.phone = "מספר טלפון לא תקין.  (למשל 05X-XXXXXXX).";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;
    // חישוב מזהה חדש ושמירה
    const existing: Ticket[] = loadTickets();
    const nextId =
      existing.length > 0
        ? Math.max(...existing.map((t: Ticket) => Number(t.id) || 0)) + 1
        : 101;

    const newTicket: Ticket = {
      id: String(nextId),
      subject: formData.subject,
      description: formData.description.trim(),
      studentId: formData.studentId.trim(),
      phone: formData.phone.trim() || undefined,
      date: formatDate(new Date()),
      status: "פתוח",
      priority: "רגילה", // ברירת מחדל – הסטודנט לא בוחר עדיפות
      department: formData.department,
      attachments,
    };

    addTicket(newTicket);
    navigate("/"); // חזרה לבית
  };

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", p: 2 }} dir="rtl">
      {/* קופסת התוכן עם מסגרת כחולה דקה */}
      <Box
        sx={{
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          פנייה חדשה
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          מלא את הפרטים ונחזור אליך בהקדם.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* מחלקה */}
          <TextField
            select
            required
            fullWidth
            margin="normal"
            label="בחר מחלקה"
            name="department"
            value={formData.department}
            onChange={handleChange("department")}
            sx={rtlFieldSx}
            error={!!errors.department}
            helperText={errors.department}
          >
            {DEPARTMENTS.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          {/* תעודת זהות */}
          <TextField
            required
            fullWidth
            margin="normal"
            label="תעודת זהות"
            name="studentId"
            value={formData.studentId}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 9); // ספרות בלבד, אורך 9
              setFormData((prev) => ({ ...prev, studentId: val }));
              setErrors((prev) => ({ ...prev, studentId: "" }));
            }}
            sx={rtlFieldSx}
            inputProps={{
              inputMode: "numeric",
              pattern: "\\d{9}",
              maxLength: 9,
            }}
            error={!!errors.studentId}
            helperText={errors.studentId || " יש להזין רק ספרות"}
          />

          {/* טלפון */}
          <TextField
            fullWidth
            margin="normal"
            label="טלפון"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10); // ספרות בלבד, עד 10
              setFormData((prev) => ({ ...prev, phone: digitsOnly }));
              setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            sx={rtlFieldSx}
            placeholder="למשל 05X-XXXXXXX"
            autoComplete="tel"
            inputProps={{
              inputMode: "numeric",
              pattern: "\\d{10}",
              maxLength: 10,
            }}
            error={!!errors.phone}
          />

          {/* נושא */}
          <TextField
            select
            required
            fullWidth
            margin="normal"
            label="נושא פנייה"
            name="subject"
            value={formData.subject}
            onChange={handleChange("subject")}
            sx={rtlFieldSx}
            error={!!errors.subject}
            helperText={errors.subject}
          >
            <MenuItem value="מערכת שעות">מערכת שעות</MenuItem>
            <MenuItem value="תשלומים">תשלומים</MenuItem>
            <MenuItem value="מבחנים">מבחנים</MenuItem>
            <MenuItem value="גישה לחומרי קורס">גישה לחומרי קורס</MenuItem>
            <MenuItem value="אחר">אחר</MenuItem>
          </TextField>

          {/* תיאור */}
          <TextField
            required
            fullWidth
            margin="normal"
            label="תיאור פנייה"
            name="description"
            value={formData.description}
            onChange={handleChange("description")}
            multiline
            rows={3}
            sx={rtlFieldSx}
            error={!!errors.description}
            helperText={errors.description}
          />

          {/* צירוף קבצים */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2" align="right">
                אפשר לבחור קבצים או לגרור אותם לאזור זה
              </Typography>
              <Button variant="contained" component="label">
                צירוף קבצים
                <input hidden type="file" multiple onChange={handleFiles} />
              </Button>
            </Stack>

            {attachments.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {attachments.map((a, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    display="block"
                    align="right"
                  >
                    • {a.name} ({(a.size / 1024).toFixed(1)} KB)
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          {/* שליחה */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained">
              שלח פנייה
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
