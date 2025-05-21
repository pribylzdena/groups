import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {User} from '@models/user';

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

  getUserFromApi(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/current`);
  }

  getFakeUser(): User {
    return new User(1, 'system@groups.cz', 'system@groups.cz');
  }
}
