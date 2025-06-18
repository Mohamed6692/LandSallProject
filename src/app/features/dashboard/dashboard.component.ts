import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../shared/models/user.model';
import { TuiArcChart, TuiBar } from '@taiga-ui/addon-charts';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiNumberFormat, TuiTextfield, TuiButton, TuiIcon, TuiAppearance } from '@taiga-ui/core';
import { TuiInputNumber, TuiActionBar, TuiButtonGroup, TuiIconBadge } from '@taiga-ui/kit';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    TuiAmountPipe,
    TuiArcChart,
    TuiBar,
    TuiInputNumber,
    TuiNumberFormat,
    TuiTextfield,
    TuiButton,
    TuiActionBar,
    TuiButtonGroup,
    TuiIcon,
    TuiIconBadge,
    TuiAppearance
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser$;

  // Propriétés pour les graphiques
  protected readonly value = [40, 30, 20, 10];
  protected readonly barValue = [30, 15, 10]; // Valeurs pour le graphique en barres
  protected activeItemIndex = NaN;

  // Signal pour gérer l'ouverture/fermeture de l'action bar
  protected open = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  testLogout(): void {
    console.log('Test de déconnexion depuis le dashboard');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  public onTextfieldChange(value: number | null): void {
    this.activeItemIndex = value ?? NaN;
  }
} 