import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '@app/services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthorizationService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    const token = this.auth.getToken();

   // return true;
    if (token) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
