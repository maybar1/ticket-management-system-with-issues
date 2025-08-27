import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Paper, Typography, IconButton, TextField, Stack,
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Divider, Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonIcon from "@mui/icons-material/Person";
import { addMessage, loadChat, seedChatFromTicketIfEmpty, type ChatMessage } from "../utils/chat";
import { loadTickets } from "../utils/storage";

export default function ChatPage() {
  const { id } = useParams();
  const ticketId = String(id || "");
  const navigate = useNavigate();

  const ticket = useMemo(() => {
    const all = loadTickets();
    return all.find(t => String(t.id) === ticketId);
  }, [ticketId]);

  // הודעות הצ'אט לשיחה זו
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  // תפקיד נוכחי מגיע מה-Header ונשמר ב-localStorage
  const currentRole: "student" | "agent" =
    (localStorage.getItem("role") as "student" | "agent") || "student";

  // שם תצוגה לפי תפקיד
  const displayName = (s: "student" | "agent") => (s === "student" ? "איילת" : "מנהל");

  // גלילה לסוף בכל שינוי
  useEffect(() => {
    setTimeout(() => listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" }), 0);
  }, [messages.length]);

  // זריעת הודעת פתיחה אם השיחה ריקה
  useEffect(() => {
    if (!ticketId) return;
    seedChatFromTicketIfEmpty(
      ticketId,
      {
        subject: ticket?.subject ?? `פנייה #${ticketId}`,
        description: ticket?.description ?? "",
        date: ticket?.date,
      },
      "איילת"
    );
    setMessages(loadChat(ticketId));
  }, [ticketId, ticket?.subject, ticket?.description, ticket?.date]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !ticketId) return;

    const msg = addMessage(ticketId, {
      sender: currentRole,
      text: trimmed,
      senderName: displayName(currentRole),
    });

    setMessages(prev => [...prev, msg]);
    setText("");
  };

  // תשובות מהירות — מוצג רק למנהל
  const quickReplies = [
    "שלום 😊 אני איתך—איך אפשר לעזור?",
    "אפשר לקבל צילום מסך?",
    "האם זה עדיין קורה עכשיו?",
    "טופל—אעדכן ברגע שיש פתרון"
  ];

  // עוזר תאריך/שעה: מקבל string | number | Date
  const dt = (value: string | number | Date) => {
    const d = new Date(value);
    const date = d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
    const time = d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", p: 2 }} dir="rtl">
      {/* פס עליון: חזור בלבד */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="חזור">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="body1"
          sx={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => navigate(-1)}
        >
          חזור
        </Typography>
      </Stack>

      {/* כותרת אמצעית + כרטיס פרטי הפנייה */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
        >
          פנייה #{ticketId}
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme => theme.palette.mode === "light" ? "grey.50" : "grey.900",
          }}
        >
          <Stack spacing={0.75}>
            <Typography variant="body1">
              <b>נושא הפנייה:</b> {ticket?.subject ?? `פנייה #${ticketId}`}
            </Typography>
            <Typography variant="body1">
              <b>סטודנט:</b> {displayName("student")}
            </Typography>
            <Typography variant="body1">
              <b>סטטוס:</b> {ticket?.status ?? "—"}
            </Typography>
            {ticket?.description && (
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                <b>תיאור:</b> {ticket.description}
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>

      {/* חלון הודעות */}
      <Paper variant="outlined" sx={{ p: 0, height: "60vh", display: "flex", flexDirection: "column" }}>
        <List ref={listRef} sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {messages.map(m => {
            const isStudent = m.sender === "student";
            const name = m.senderName || displayName(m.sender);
            const { date, time } = dt(m.ts);

            return (
              <ListItem
                key={m.id}
                disableGutters
                sx={{
                  display: "flex",
                  justifyContent: isStudent ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                {!isStudent && (
                  <ListItemAvatar sx={{ mr: 1 }}>
                    <Avatar sx={{ bgcolor: "grey.300" }}>
                      <SupportAgentIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}

                <Box sx={{ maxWidth: "70%" }}>
                  {/* בועה */}
                  <Paper
                    elevation={0}
                    sx={{
                      px: 1.5,
                      py: 1,
                      bgcolor: isStudent ? "primary.light" : "grey.100",
                      color: isStudent ? "primary.contrastText" : "text.primary",
                      borderRadius: 2,
                      borderTopRightRadius: isStudent ? 2 : 0,
                      borderTopLeftRadius: isStudent ? 0 : 2,
                    }}
                  >
                    <ListItemText
                      primary={m.text}
                      primaryTypographyProps={{ sx: { whiteSpace: "pre-wrap" } }}
                    />
                  </Paper>

                  {/* שורת מטה: שם • שעה • תאריך */}
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      color: "text.secondary",
                      display: "block",
                      textAlign: isStudent ? "left" : "right",
                    }}
                  >
                    {name} • {time} • {date}
                  </Typography>
                </Box>

                {isStudent && (
                  <ListItemAvatar sx={{ ml: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* שורת כתיבה */}
        <Box sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              placeholder="כתבי הודעה…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              inputProps={{ dir: "rtl" }}
            />
            <IconButton color="primary" onClick={handleSend} aria-label="שלח">
              <SendIcon />
            </IconButton>
          </Stack>

          {/* תשובות מהירות — רק למנהל */}
          {currentRole === "agent" && (
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
              {quickReplies.map(q => (
                <Button
                  key={q}
                  size="small"
                  variant="outlined"
                  onClick={() => setText(prev => (prev ? prev + " " + q : q))}
                >
                  {q}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
