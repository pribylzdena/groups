import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Note} from '@models/note';
import {AuthorizationService} from '@app/services/authorization.service';
import { Event } from '@models/event';

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

  getEventsFromApi(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/groups/${groupId}/events`);
  }

  createEvent(event: Event, groupId: number): Observable<any> {
    console.log('Calling: ' + `${environment.apiUrl}/api/groups/${groupId}/events`);
    console.log(event);
    return this.http.post<any>(`${environment.apiUrl}/api/groups/${groupId}/events`, event.format());
  }
}
