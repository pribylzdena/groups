import { Injectable } from '@angular/core';
import {Group} from '@models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups: Group[] = [
    { id: 1, name: 'Group1', members: 95 },
    { id: 2, name: 'Group2', members: 100 },
    { id: 3, name: 'Group3', members: 9 },
    { id: 4, name: 'Group4', members: 5 }
  ];

  getGroupById(id: number) {
    return this.groups.find(g => g.id === id);
  }

  getAllGroups() {
    return this.groups;
  }
}
