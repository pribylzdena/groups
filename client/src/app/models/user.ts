export class User {
  id: number;
  name: string;
  password?: string;
  email: string;
  logoUrl: string;

  constructor(  id: number, name: string, email: string, logoUrl: string, password?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.logoUrl = logoUrl;
    this.password = password;
  }
}
