import {User} from '@models/user';

export class GroupMember {
  id: number;
  userId: number;
  groupId: number;
  role: string;

  user?: User;

  constructor(id: number, userId: number, groupId: number, role: string) {
    this.id = id;
    this.userId = userId;
    this.groupId = groupId;
    this.role = role;
  }
}
