import {User} from '@models/user';

export class GroupMember {
  id: number;
  role: string;
  user: User;

  constructor(id: number, role: string, user: User) {
    this.id = id;
    this.role = role;
    this.user = user;
  }
}
