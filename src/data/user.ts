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
  new User("u001", "דנה כהן", "dana@example.com", "050-1234567"),
  new User("u002", "ליאור לוי", "lior@example.com", "052-9876543"),
  new User("u003", "נועה רז", "noa@example.com", "053-4567890"),
];
