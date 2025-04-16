import {User} from '@models/user';

export class TaskComment {
  id: number;
  value: string;
  user: User;

  respondTo?: TaskComment;
  constructor(id: number, value: string, respondTo: TaskComment, user: User) {
    this.id = id;
    this.value = value;
    this.respondTo = respondTo;
    this.user = user;
  }
}
