import {User} from '@models/user';

export class Event {
  constructor(
    public id: number,
    public name: string,
    public startsAt: Date,
    public endsAt: Date,
    public status: string,
    public color: string,
    public groupId: number,
    public eventParticipants: User[]
  ) {}
}
