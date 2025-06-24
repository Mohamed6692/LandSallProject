import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { AuthRequest, AuthResponse, UserDTO, UserProfile } from '../../shared/models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        this.currentUserSubject.next(userData);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        this.clearAuthData();
      }
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    console.log('Données envoyées pour la connexion:', credentials); // 👈 Ajout du log
  
    this.clearAuthData();
  
    return this.http.post<AuthResponse>(this.apiService.loginUrl, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }
  

  register(userData: UserDTO): Observable<any> {
    return this.http.post(this.apiService.registerUrl, userData);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(this.apiService.meUrl);
  }

  logout(): void {
    this.clearAuthData();
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(isJson: boolean = true): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (isJson) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  getCurrentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  refreshAuthState(): void {
    this.loadStoredUser();
  }
} 