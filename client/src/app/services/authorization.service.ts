import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  register(payload: RegisterRequest): Observable<{id: number}> {
    return this.http.post<{ id: number }>(
      `${environment.apiUrl}/api/auth/register`,
      payload
    );
  }

  login(payload: LoginRequest): Observable<string> {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/api/auth/login`, payload)
      .pipe(
        tap(res => {
          localStorage.setItem('auth_token', res.token);
          this.isLoggedInSubject.next(true);
        }),
        map(res => res.token)
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUserId(): number | null {
    return this.getClaimFromToken(this.getToken(), 'id');
  }

  getClaimFromToken(token: string, claimKey: string): any {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken[claimKey] : null;
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Chyba při dekódování JWT tokenu:', error);
      return null;
    }
  }
}
