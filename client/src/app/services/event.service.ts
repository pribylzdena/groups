import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Note} from '@models/note';
import {AuthorizationService} from '@app/services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http: HttpClient;
  private authService: AuthorizationService;

  constructor(http: HttpClient, authService: AuthorizationService) {
    this.http = http;
    this.authService = authService;
  }

  getEventsFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/groups/{groupId}/events`);
  }

  getEventFromApi(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/groups/{groupId}/events/{id}`);
  }

  createEvent(event: Event): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }); // TODO change to intercept

    return this.http.post<any>(`${environment.apiUrl}/api/groups/{groupId}/events`, event, { headers });
  }
}
