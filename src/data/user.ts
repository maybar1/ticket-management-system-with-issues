export class User {
  id: string;
  name: string;
  email: string;
  phone: string;

  constructor(id: string, name: string, email: string, phone: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}


export const users: User[] = [
  new User("366495761", "דנה כהן", "dana@365.ono.ac.il", "050-1234567"),
  new User("368495762", "ליאור לוי", "lior@365.ono.ac.il", "052-9876543"),
  new User("366505763", "נועה רז", "noa@365.ono.ac.il", "053-4567890"),
];
