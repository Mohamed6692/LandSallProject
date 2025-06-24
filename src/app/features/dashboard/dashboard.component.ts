import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../shared/models/user.model';
import { TuiArcChart, TuiBar } from '@taiga-ui/addon-charts';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiNumberFormat, TuiTextfield, TuiButton, TuiIcon, TuiAppearance } from '@taiga-ui/core';
import { TuiInputNumber, TuiActionBar, TuiButtonGroup } from '@taiga-ui/kit';
import {ChangeDetectionStrategy,  inject} from '@angular/core';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {TuiConfirmService} from '@taiga-ui/kit';
import type {PolymorpheusContent} from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { LandCreateComponent } from '../lands/land-create/land-create.component';

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
    TuiAppearance,
    FormsModule, 
    TuiButton, 
    LandCreateComponent,
  ],
  providers: [
    TuiConfirmService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser$;

  // Propriétés pour les graphiques
  protected readonly value = [40, 30, 20, 10];
  protected readonly barValue = [30, 15, 10]; // Valeurs pour le graphique en barres
  protected activeItemIndex = NaN;
  private readonly dialogs = inject(TuiDialogService);
  private readonly confirm = inject(TuiConfirmService);

  protected values = '';

  protected onModelChange(values: string): void {
    this.values = values;
    this.confirm.markAsDirty();
}
  // Signal pour gérer l'ouverture/fermeture de l'action bar
  protected open = signal(false);

  showLandCreate = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly dialogService: TuiDialogService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  protected onClick(): void {
    this.showLandCreate = true;
  }

  onLandCreateClose() {
    console.log('onLandCreateClose called');
    this.showLandCreate = false;
  }

  testLogout(): void {
    console.log('Test de déconnexion depuis le dashboard');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  public onTextfieldChange(value: number | null): void {
    this.activeItemIndex = value ?? NaN;
  }

  goToLandList() {
    this.router.navigate(['/lands/list']);
  }
} 