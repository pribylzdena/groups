import {EventParticipant} from '@models/event-participant';

export class Event {
  id: number;
  name: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  color: string;
  participants: EventParticipant[]
  constructor(
     id: number,
     name: string,
     startsAt: Date,
     endsAt: Date,
     status: string,
     color: string,
     participants: EventParticipant[]
  ) {
    this.id = id;
    this.name = name;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
    this.status = status;
    this.color = color;
    this.participants = participants;
  }
}
