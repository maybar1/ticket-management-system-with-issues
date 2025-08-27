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
];
