import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LandImage } from '../../shared/models/land-image.model';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

interface ApiResponse {
    message: string;
    images: LandImage[];
}

@Injectable({
  providedIn: 'root'
})
export class LandImageService {
  private apiUrl = `${environment.apiUrl}/land-images`;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService,
    private configService: ConfigService
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

  getImagesByLandId(landId: string): Observable<LandImage[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/land/${landId}`, { headers: this.authService.getAuthHeaders() }).pipe(
      map(response => response.images.map(image => ({
        ...image,
        imageUrl: `${this.configService.landsUrlImage}/${image.imageUrl}`
      })))
    );
  }

  deleteImage(imageId: string): Observable<any> {
    return this.http.delete(
      `${this.apiService.landsUrlImage}/${imageId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
} 