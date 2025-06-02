import {User} from '@models/user';

export class TaskComment {
  id: number;
  value: string;
  user: User;
  createdAt: Date;

  respondTo?: TaskComment;
  constructor(id: number, value: string, respondTo: TaskComment, user: User, createdAt?: Date) {
    this.id = id;
    this.value = value;
    this.respondTo = respondTo;
    this.user = user;
    this.createdAt = createdAt || new Date();
  }
}
