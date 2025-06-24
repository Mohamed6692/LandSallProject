import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  constructor() {}

  get apiUrl(): string {
    return environment.apiUrl;
  }

  get isProduction(): boolean {
    return environment.production;
  }

  get authUrl(): string {
    return `${this.apiUrl}/auth`;
  }

  get landsUrlImage(): string {
    return `${this.apiUrl}/land-images`;
  }


  get landsUrl(): string {
    return `${this.apiUrl}/lands`;
  }

  get usersUrl(): string {
    return `${this.apiUrl}/users`;
  }

  get reservationsUrl(): string {
    return `${this.apiUrl}/reservations`;
  }

  get messagesUrl(): string {
    return `${this.apiUrl}/messages`;
  }

  get reviewsUrl(): string {
    return `${this.apiUrl}/reviews`;
  }
} 