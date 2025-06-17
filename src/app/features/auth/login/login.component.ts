import { CommonModule } from '@angular/common';
import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiFieldErrorPipe, TuiSegmented, TuiSwitch, TuiTooltip} from '@taiga-ui/kit';
import {TuiCardLarge, TuiForm, TuiHeader} from '@taiga-ui/layout';
import {
    TuiAppearance,
    TuiButton,
    TuiError,
    TuiIcon,
    TuiNotification,
    TuiTextfield,
    TuiTitle,
} from '@taiga-ui/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthRequest, UserDTO, Role } from '../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiIcon,
    TuiNotification,
    TuiSegmented,
    TuiSwitch,
    TuiTextfield,
    TuiTitle,
    TuiTooltip,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent implements OnInit, OnDestroy {
  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    isLogin: new FormControl(true),
  });

  // Formulaire séparé pour l'inscription
  protected readonly registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.pattern(/^(0[1-9]\d{8})$/)]),
  });

  protected isLoading = false;
  protected errorMessage = '';
  protected successMessage = '';
  private messageTimeout: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Nettoyer le formulaire et s'assurer qu'on est en mode login
    this.resetForm();
    
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }

  private resetForm(): void {
    this.form.reset({
      email: '',
      password: '',
      isLogin: true
    });
    this.registerForm.reset({
      name: '',
      firstName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  protected onSubmit(): void {
    console.log('onSubmit appelé');
    console.log('Mode login:', this.form.get('isLogin')?.value);
    
    if (this.form.get('isLogin')?.value) {
      // Mode login
      console.log('Formulaire login valide:', this.form.valid);
      console.log('Valeurs du formulaire login:', this.form.value);
      
      if (this.form.valid) {
        this.isLoading = true;
        this.errorMessage = '';
        console.log('Appel de handleLogin');
        this.handleLogin();
      } else {
        console.log('Formulaire login invalide, erreurs:', this.getInvalidControls(this.form));
      }
    } else {
      // Mode register
      console.log('Formulaire register valide:', this.registerForm.valid);
      console.log('Valeurs du formulaire register:', this.registerForm.value);
      
      if (this.registerForm.valid) {
        this.isLoading = true;
        this.errorMessage = '';
        console.log('Appel de handleRegister');
        this.handleRegister();
      } else {
        console.log('Formulaire register invalide, erreurs:', this.getInvalidControls(this.registerForm));
      }
    }
  }

  private getInvalidControls(formGroup: FormGroup): string[] {
    const invalidControls: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && !control.valid) {
        invalidControls.push(`${key}: ${JSON.stringify(control.errors)}`);
      }
    });
    return invalidControls;
  }

  private handleLogin(): void {
    console.log('handleLogin appelé');
    const credentials: AuthRequest = {
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || ''
    };

    console.log('Credentials préparés:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        const successMessage = response.message || 'Connexion réussi2 !';
        this.setMessage(successMessage, false, false);
        this.notificationService.showSuccess(successMessage);
        this.isLoading = false;
        
        // Redirection après un court délai pour permettre l'affichage du message
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        
        // Amélioration de la gestion des erreurs
        let errorMessage = 'Erreur de connexion';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.setMessage(errorMessage, true);
        this.notificationService.showError(errorMessage);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleRegister(): void {
    console.log('handleRegister appelé');
    
    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      const errorMessage = 'Les mots de passe ne correspondent pas';
      this.setMessage(errorMessage, true);
      this.notificationService.showError(errorMessage);
      this.isLoading = false;
      return;
    }

    const userData: UserDTO = {
      name: this.registerForm.get('name')?.value || '',
      firstName: this.registerForm.get('firstName')?.value || '',
      email: this.registerForm.get('email')?.value || '',
      password: this.registerForm.get('password')?.value || '',
      phoneNumber: this.registerForm.get('phoneNumber')?.value || '',
      role: Role.USER
    };

    console.log('Données d\'inscription:', userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        const successMessage = response.message || 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.setMessage(successMessage, false, false);
        this.notificationService.showSuccess(successMessage);
        this.isLoading = false;
        
        // Basculer vers le mode connexion après inscription réussie
        setTimeout(() => {
          this.form.patchValue({ 
            isLogin: true,
            email: this.registerForm.get('email')?.value || '',
            password: ''
          });
          this.clearMessages();
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur d\'inscription:', error);
        
        // Amélioration de la gestion des erreurs
        let errorMessage = 'Erreur d\'inscription';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.setMessage(errorMessage, true);
        this.notificationService.showError(errorMessage);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  private setMessage(message: string, isError: boolean = false, autoClear: boolean = true): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    
    if (isError) {
      this.errorMessage = message;
      this.successMessage = '';
    } else {
      this.successMessage = message;
      this.errorMessage = '';
    }
    
    this.cdr.detectChanges();
    
    if (autoClear) {
      this.messageTimeout = setTimeout(() => {
        this.clearMessages();
      }, 5000);
    }
  }
}
