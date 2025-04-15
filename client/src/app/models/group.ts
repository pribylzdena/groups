import {GroupMember} from '@models/group-member';

export class Group {
  id: number;
  name: string;
  members: GroupMember[];
  constructor(  id: number, name: string, members: GroupMember[],) {
    this.id = id;
    this.name = name;
    this.members = members;
  }
}
