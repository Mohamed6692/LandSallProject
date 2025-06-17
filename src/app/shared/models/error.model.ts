export interface BackendError {
  message?: string;
  error?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  details?: any;
}

export interface ApiErrorResponse {
  error: BackendError | string;
  status: number;
  statusText: string;
}

// Types d'erreurs courantes du backend
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorInfo {
  message: string;
  source: 'BACKEND' | 'FRONTEND';
  type: ErrorType;
  originalError?: any;
} 