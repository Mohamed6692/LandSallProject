import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LandsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  createLand(land: any): Observable<any> {
    return this.http.post(
      `${this.apiService.landsUrl.replace(/\/$/, '')}`, // pour matcher ton endpoint backend
      land,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getLandsByUserId(userId: string, page: number = 0, size: number = 10): Observable<any> {
    const url = `${this.apiService.landsUrl}/user/${userId}`;
    return this.http.get(url, {
      headers: this.authService.getAuthHeaders(),
      params: { page, size }
    });
  }

  // Tu pourras ajouter ici getAllLands, getLandById, etc. en suivant la même logique
}