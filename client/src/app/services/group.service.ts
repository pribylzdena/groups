import { Injectable } from '@angular/core';
import { Group } from '@models/group';
import { GroupMember } from '@models/group-member';
import { User } from '@models/user';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '@app/services/authorization.service';
import {Note} from '@models/note';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http: HttpClient;
  private authService: AuthorizationService;

  constructor(http: HttpClient, authService: AuthorizationService) {
    this.http = http;
    this.authService = authService;
  }

  private groups: Group[] = [
    new Group(1, 'Developers', [
      new GroupMember(1, 'admin', new User(1, 'Alice', 'alice@example.com', '/assets/avatars/alice.png')),
      new GroupMember(2, 'member', new User(2, 'Bob', 'bob@example.com', '/assets/avatars/bob.png'))
    ]),
    new Group(2, 'Designers', [
      new GroupMember(3, 'admin', new User(3, 'Carol', 'carol@example.com', '/assets/avatars/carol.png')),
      new GroupMember(4, 'member', new User(4, 'Dave', 'dave@example.com', '/assets/avatars/dave.png'))
    ]),
    new Group(3, 'Marketing', [
      new GroupMember(5, 'admin', new User(5, 'Eve', 'eve@example.com', '/assets/avatars/eve.png')),
      new GroupMember(6, 'member', new User(6, 'Frank', 'frank@example.com', '/assets/avatars/frank.png')),
      new GroupMember(7, 'member', new User(7, 'Grace', 'grace@example.com', '/assets/avatars/grace.png')),
      new GroupMember(9, 'member', new User(7, 'Grace', 'grace@example.com', '/assets/avatars/grace.png')),
      new GroupMember(10, 'member', new User(7, 'Grace', 'grace@example.com', '/assets/avatars/grace.png')),
      new GroupMember(11, 'member', new User(7, 'Grace', 'grace@example.com', '/assets/avatars/grace.png')),
      new GroupMember(12, 'member', new User(7, 'Grace', 'grace@example.com', '/assets/avatars/grace.png')),
    ]),
    new Group(4, 'QA Team', [
      new GroupMember(8, 'admin', new User(8, 'Heidi', 'heidi@example.com', '/assets/avatars/heidi.png'))
    ])
  ];

  getGroupById(id: number) {
    return this.groups.find(g => g.id === id);
  }

  getAllGroups() {
    return this.groups;
  }

  getGroupsFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Groups`);
  }

  getGroupFromApi(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Groups/${id}`);
  }

  createGroup(name: string): Observable<any> {
    const body = { name };
    return this.http.post<any>(`${environment.apiUrl}/api/Groups`, body);
  }

  updateGroup(group: Group): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/groups/${group.id}`, group);
  }
}
