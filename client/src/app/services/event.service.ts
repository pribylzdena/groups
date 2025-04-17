import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http: HttpClient
  constructor(http: HttpClient) {
    this.http = http;
  }

  getEventsFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/events`);
  }
}
