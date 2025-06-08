import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {User} from '@models/user';
import {Group} from '@models/group';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http: HttpClient
  constructor(http: HttpClient) {
    this.http = http;
  }

  getUsersFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/users`);
  }

  getUsersForCurrentGroup(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/groups/${groupId}/users`);
  }

  getUserFromApi(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/current`);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/users/${user.id}`, user);
  }

  getFakeUser(): User {
    return new User(1, 'system@groups.cz', 'system@groups.cz');
  }
}
