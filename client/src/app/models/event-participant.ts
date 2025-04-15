import {User} from '@models/user';

export class EventParticipant {
  id: number;
  confirm: boolean
  user: User;

  constructor(id: number, confirm: boolean, user: User) {
    this.id = id;
    this.confirm = confirm;
    this.user = user;
  }

}
