import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorInfo, ErrorType, BackendError } from '../../shared/models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorAnalyzerService {

  analyzeError(error: HttpErrorResponse): ErrorInfo {
    console.log('=== ANALYSE DÉTAILLÉE DE L\'ERREUR ===');
    console.log('Erreur complète:', error);
    
    let message = 'Une erreur est survenue';
    let source: 'BACKEND' | 'FRONTEND' = 'FRONTEND';
    let type: ErrorType = ErrorType.UNKNOWN_ERROR;
    
    // Analyse du status HTTP
    if (error.status) {
      switch (error.status) {
        case 400:
          type = ErrorType.VALIDATION_ERROR;
          message = 'Données invalides';
          break;
        case 401:
          type = ErrorType.AUTHENTICATION_ERROR;
          message = 'Authentification requise';
          break;
        case 403:
          type = ErrorType.AUTHORIZATION_ERROR;
          message = 'Accès non autorisé';
          break;
        case 404:
          type = ErrorType.NOT_FOUND_ERROR;
          message = 'Ressource non trouvée';
          break;
        case 500:
          type = ErrorType.INTERNAL_SERVER_ERROR;
          message = 'Erreur interne du serveur';
          break;
        default:
          type = ErrorType.UNKNOWN_ERROR;
          message = 'Erreur inconnue';
      }
    }
    
    // Analyse du contenu de l'erreur
    if (error.error) {
      source = 'BACKEND';
      
      if (typeof error.error === 'string') {
        message = error.error;
        console.log('Message backend (string):', message);
      } else if (error.error && typeof error.error === 'object') {
        const backendError = error.error as BackendError;
        
        if (backendError.message) {
          message = backendError.message;
          console.log('Message backend (message):', message);
        } else if (backendError.error) {
          message = backendError.error;
          console.log('Message backend (error):', message);
        }
        
        // Analyse des détails si disponibles
        if (backendError.details) {
          console.log('Détails de l\'erreur:', backendError.details);
        }
      }
    } else if (error.message) {
      source = 'FRONTEND';
      message = error.message;
      console.log('Message frontend:', message);
    }
    
    // Détection des erreurs réseau
    if (error.status === 0 || error.statusText === 'Unknown Error') {
      type = ErrorType.NETWORK_ERROR;
      message = 'Erreur de connexion au serveur';
      source = 'FRONTEND';
    }
    
    const errorInfo: ErrorInfo = {
      message,
      source,
      type,
      originalError: error
    };
    
    console.log('Résultat de l\'analyse:', errorInfo);
    console.log('=== FIN ANALYSE ===');
    
    return errorInfo;
  }
  
  isBackendError(error: HttpErrorResponse): boolean {
    return error.error !== null && error.error !== undefined;
  }
  
  getBackendMessage(error: HttpErrorResponse): string | null {
    if (!this.isBackendError(error)) {
      return null;
    }
    
    if (typeof error.error === 'string') {
      return error.error;
    }
    
    if (error.error && typeof error.error === 'object') {
      const backendError = error.error as BackendError;
      return backendError.message || backendError.error || null;
    }
    
    return null;
  }
} 