export type UserRole = "student" | "team";

export type User = {
  id: string;       
  name: string;
  email: string;   
  phone: string;   
  role: UserRole;   
};


export const users: User[] = [
  { id: "366495761", name: "דנה כהן",  email: "dana@365.ono.ac.il",  phone: "0501234567", role: "student" },
  { id: "368495762", name: "ליאור לוי", email: "lior@365.ono.ac.il", phone: "0529876543", role: "team"    },
  { id: "366505763", name: "נועה רז",   email: "noa@365.ono.ac.il",  phone: "0534567890", role: "student" },
  { id: "366515764", name: "אורי ממן",  email: "uri@365.ono.ac.il",  phone: "0541234567", role: "student" },
  { id: "366525765", name: "מאיה לוי",  email: "maya@365.ono.ac.il",  phone: "0551234567", role: "student" },
  { id: "366535766", name: "יוסי כהן",  email: "yossi@365.ono.ac.il",  phone: "0561234567", role: "team" },
  { id: "366545767", name: "תמר ישראלי", email: "tamar@365.ono.ac.il", phone: "0571234567", role: "student" },
  { id: "366555768", name: "איתן לוי", email: "eitan@365.ono.ac.il", phone: "0581234567", role: "student" }
];
