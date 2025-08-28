import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate, useParams } from "react-router-dom";
import { loadTickets } from "../utils/storage";

export default function SubmissionSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = loadTickets().find(t => String(t.id) === String(id));

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", p: 2 }} dir="rtl">
      <Typography variant="h5" align="center" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
        פנייתך התקבלה
      </Typography>

      <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          תודה! פנייה #{id} נרשמה במערכת.
        </Typography>

        {ticket && (
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            {ticket.subject && <>נושא: <b>{ticket.subject}</b></>}
            {ticket.department && <>, מחלקה: <b>{ticket.department}</b></>}
          </Typography>
        )}

        <Typography sx={{ mb: 2 }}>
          צוות התמיכה קיבל את הפנייה ויחזור אליך בהקדם. אפשר לעקוב אחר הטיפול במסך השיחה.
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center">
          {/* עדכני את הנתיב לצ'אט אם שונה אצלך */}
          <Button variant="contained" onClick={() => navigate(`/chat/${id}`)}>לצפייה בשיחה</Button>
          <Button variant="outlined" onClick={() => navigate("/")}>חזרה לבית</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
