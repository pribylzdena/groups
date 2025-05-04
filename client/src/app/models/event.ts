import {EventParticipant} from '@models/event-participant';

export class Event {
  id: number;
  name: string;
  startsAt: Date;
  endsAt: Date;
  status: number;
  color: string;
  participants: EventParticipant[]
  constructor(
     id: number,
     name: string,
     startsAt: Date,
     endsAt: Date,
     status: number,
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

  format() {
    return {
      name: this.name,
      startsAt: this.startsAt.toString(),
      endsAt: this.endsAt.toString(),
      status: this.status,
      color: this.color,
      participants: this.participants
    };
  }
}
