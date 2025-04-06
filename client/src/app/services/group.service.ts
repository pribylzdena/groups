import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups = [
    { id: '1', name: 'Group1', members: 95 },
    { id: '2', name: 'Group2', members: 945 },
    { id: '3', name: 'Group3', members: 9 },
    { id: '4', name: 'Group4', members: 5 },
  ];

  getGroupById(id: string) {
    return this.groups.find(g => g.id === id);
  }

  getAllGroups() {
    return this.groups;
  }
}
