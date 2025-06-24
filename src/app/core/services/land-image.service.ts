import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandImageService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  uploadImage(file: File, landId: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('landId', landId);

    return this.http.post(
      `${this.apiService.landsUrlImage}/upload`,
      formData,
      { headers: this.authService.getAuthHeaders(false) }
    );
  }

  getImagesByLandId(landId: string): Observable<any> {
    return this.http.get(
      `${this.apiService.landsUrlImage}/land/${landId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteImage(imageId: string): Observable<any> {
    return this.http.delete(
      `${this.apiService.landsUrlImage}/${imageId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
} 