// src/components/NewTicket.tsx
import { useState } from "react";

type CreatePayload = { subject: string; description: string };
type NewTicketProps = {
  onCreate?: (payload: CreatePayload) => void;
};

export default function NewTicket({ onCreate }: NewTicketProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    onCreate?.({ subject: subject.trim(), description: description.trim() });
    setSubject("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
      <label>
        נושא
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="כותרת הפנייה"
        />
      </label>

      <label>
        תיאור
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="פרטי הבעיה"
          rows={4}
        />
      </label>

      <div>
        <button type="submit">שליחה</button>
      </div>
    </form>
  );
}
