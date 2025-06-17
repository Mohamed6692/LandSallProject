import { CommonModule } from '@angular/common';
import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.pattern(/^(0[1-9]\d{8})$/)]),
    isLogin: new FormControl(true),
  });

  protected isLoading = false;
  protected errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  protected onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      if (this.form.get('isLogin')?.value) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    }
  }

  private handleLogin(): void {
    const credentials: AuthRequest = {
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || ''
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = error.error?.error || 'Erreur de connexion';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleRegister(): void {
    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.isLoading = false;
      return;
    }

    const userData: UserDTO = {
      name: this.form.get('name')?.value || '',
      firstName: this.form.get('firstName')?.value || '',
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || '',
      phoneNumber: this.form.get('phoneNumber')?.value || '',
      role: Role.USER
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.errorMessage = '';
        // Basculer vers le mode connexion après inscription réussie
        this.form.patchValue({ isLogin: true });
        this.form.get('password')?.setValue('');
        this.form.get('confirmPassword')?.setValue('');
      },
      error: (error) => {
        console.error('Erreur d\'inscription:', error);
        this.errorMessage = error.error?.error || 'Erreur d\'inscription';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
