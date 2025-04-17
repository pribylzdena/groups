import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment.development';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private http: HttpClient
  constructor(http: HttpClient) {
    this.http = http;
  }

  register(payload: RegisterRequest): Observable<{id: number}> {
    return this.http.post<{ id: number }>(
      `${environment.apiUrl}/api/auth/register`,
      payload
    );
  }
}
