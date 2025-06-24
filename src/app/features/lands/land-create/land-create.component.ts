import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LandsService } from '../../../core/services/lands.service';
import { LandDTO } from '../../../shared/models/land.model';
import {TuiTextfield, TuiButton} from '@taiga-ui/core';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TuiInputFiles, TuiFiles, TuiFileLike, TuiAvatar } from '@taiga-ui/kit';
import { TuiIcon, TuiLink } from '@taiga-ui/core';
import { LandImageService } from '../../../core/services/land-image.service';

@Component({
  selector: 'app-land-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiTextfield, TuiButton, TuiInputFiles, TuiFiles, TuiAvatar, TuiIcon, TuiLink],
  templateUrl: './land-create.component.html',
  styleUrl: './land-create.component.css'
})
export class LandCreateComponent implements OnInit, OnDestroy {
  landForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    latitude: new FormControl(0, Validators.required),
    longitude: new FormControl(0, Validators.required),
    areaM2: new FormControl(0, Validators.required),
    price: new FormControl(0, Validators.required),
    sellerId: new FormControl('', Validators.required),
  });
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  imageControl = new FormControl<TuiFileLike[] | null>(null);
  currentStep = 1;
  createdLandId: string | null = null;

  @Output() landCreated = new EventEmitter<LandDTO>();
  @Output() close = new EventEmitter<void>();

  constructor(
     private landsService: LandsService,
     private authService: AuthService,
     private notificationService: NotificationService,
     private cdr: ChangeDetectorRef,
     private landImageService: LandImageService
    ) {
      console.log('LandCreateComponent construit');
    }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUserValue();
    console.log('Utilisateur courant récupéré:', currentUser);
    const sellerId = currentUser ? currentUser.id : '';
    this.landForm.patchValue({ sellerId });
  }

  ngOnDestroy() {
    console.log('LandCreateComponent détruit');
  }

  onFilesChanged(files: TuiFileLike[] | null) {
    this.imageControl.setValue(files);
  }

  goToStep2() {
    if (this.landForm.invalid) {
      this.notificationService.showError('Veuillez remplir tous les champs obligatoires.');
      this.landForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.success = null;
    const land: LandDTO = this.landForm.value as LandDTO;
    this.landsService.createLand(land).subscribe({
      next: (res) => {
        console.log('Réponse API createLand:', res);
        console.log('ID retourné:', res.land?.id);
        this.success = 'Terrain créé avec succès. Passez à l\'étape suivante pour ajouter des images.';
        this.notificationService.showSuccess(this.success);
        this.createdLandId = res.land?.id;
        this.currentStep = 2;
        this.isLoading = false;
        console.log('isLoading:', this.isLoading, 'currentStep:', this.currentStep);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du terrain';
        let errorMessage = this.error;
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error) {
            errorMessage = err.error.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.notificationService.showError(errorMessage);
        this.isLoading = false;
      }
    });
  }

  goToStep1() {
    this.currentStep = 1;
    this.success = null;
    this.error = null;
    this.imageControl.setValue(null);
  }

  submitImages() {
    if (!this.createdLandId) {
      this.error = 'Aucun terrain à associer aux images.';
      this.notificationService.showError(this.error);
      return;
    }
    const files = this.imageControl.value || [];
    if (files.length === 0) {
      this.error = "Veuillez sélectionner au moins une image.";
      this.notificationService.showError(this.error);
      return;
    }
    this.error = null;
    this.isLoading = true;
    let uploadCount = 0;
    let hasError = false;
    files.forEach(fileLike => {
      const file = (fileLike instanceof File) ? fileLike : (fileLike as any).file;
      if (!file) {
        uploadCount++;
        return;
      }
      this.landImageService.uploadImage(file, this.createdLandId!).subscribe({
        next: () => {
          uploadCount++;
          if (uploadCount === files.length && !hasError) {
            this.success = 'Toutes les images ont été uploadées avec succès.';
            this.notificationService.showSuccess(this.success);
            this.landCreated.emit(this.landForm.value as LandDTO);
            this.close.emit();
            this.isLoading = false;
          }
        },
        error: (imgErr: any) => {
          hasError = true;
          console.error('Erreur upload image:', imgErr);
          this.error = 'Erreur upload image: ' + (imgErr?.error?.message || imgErr?.message || JSON.stringify(imgErr));
          this.notificationService.showError(this.error);
          this.isLoading = false;
        }
      });
    });
  }

  cancel() {
    this.close.emit();
  }
}
