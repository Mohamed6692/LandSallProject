import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private configService: ConfigService) {}

  // URLs d'authentification
  get loginUrl(): string {
    return `${this.configService.authUrl}/login`;
  }

  get registerUrl(): string {
    return `${this.configService.authUrl}/register`;
  }

  get meUrl(): string {
    return `${this.configService.authUrl}/me`;
  }

  // URLs pour les terrains
  get landsUrl(): string {
    return this.configService.landsUrl;
  }

  //Urls pour les imaages terrains 
  get landsUrlImage(): string{
    return this.configService.landsUrlImage;

  }

  get landByIdUrl(): (id: string) => string {
    return (id: string) => `${this.configService.landsUrl}/${id}`;
  }

  // URLs pour les utilisateurs
  get usersUrl(): string {
    return this.configService.usersUrl;
  }

  get userByIdUrl(): (id: string) => string {
    return (id: string) => `${this.configService.usersUrl}/${id}`;
  }

  // URLs pour les réservations
  get reservationsUrl(): string {
    return this.configService.reservationsUrl;
  }

  get reservationByIdUrl(): (id: string) => string {
    return (id: string) => `${this.configService.reservationsUrl}/${id}`;
  }

  // URLs pour les messages
  get messagesUrl(): string {
    return this.configService.messagesUrl;
  }

  get messageByIdUrl(): (id: string) => string {
    return (id: string) => `${this.configService.messagesUrl}/${id}`;
  }

  // URLs pour les avis
  get reviewsUrl(): string {
    return this.configService.reviewsUrl;
  }

  get reviewByIdUrl(): (id: string) => string {
    return (id: string) => `${this.configService.reviewsUrl}/${id}`;
  }

  // Méthode utilitaire pour construire des URLs avec paramètres
  buildUrl(baseUrl: string, params?: Record<string, string | number>): string {
    if (!params) {
      return baseUrl;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
} 