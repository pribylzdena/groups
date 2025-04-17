import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';

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
}
