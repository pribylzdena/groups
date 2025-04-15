import {User} from '@models/user';

export class NotificationRecipient {
  id: number;
  user: User;

  readAt?: Date;

  constructor(id: number, user: User, readAt?: Date) {
    this.id = id;
    this.user = user;
    this.readAt = readAt;
  }
}
