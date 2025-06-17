import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si l'erreur est 401 (non autorisé), nettoyer l'authentification
      if (error.status === 401) {
        console.log('Token expiré ou invalide, déconnexion automatique');
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
} 