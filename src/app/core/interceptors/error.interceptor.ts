import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erreur HTTP interceptée:', error);
      
      // Améliorer la gestion des erreurs pour préserver les messages du backend
      if (error.error) {
        // Si l'erreur contient déjà des données structurées, les préserver
        return throwError(() => error);
      } else {
        // Si c'est une erreur réseau ou autre, créer un message d'erreur générique
        const customError = {
          ...error,
          error: {
            message: error.status === 0 ? 'Erreur de connexion au serveur' : 
                    error.status === 404 ? 'Ressource non trouvée' :
                    error.status === 500 ? 'Erreur interne du serveur' :
                    'Une erreur est survenue'
          }
        };
        return throwError(() => customError);
      }
    })
  );
} 