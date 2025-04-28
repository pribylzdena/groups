import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthorizationService } from '@app/services/authorization.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthorizationService);
  const token = authService.getToken();

  console.log(token)

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return next(authReq);
  }

  return next(req);
};
