import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="
      background-color: #1b1e16; 
      color: white; 
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <h1 style="margin: 0; font-size: 1.5rem;">Land Sales</h1>
      </div>
      
      <div style="display: flex; align-items: center; gap: 1rem;">
        <ng-container *ngIf="currentUser$ | async as user; else loginButton">
          <span>Bienvenue, {{ user.name }}</span>
          <button 
            (click)="logout()"
            style="
              background-color: transparent;
              border: 1px solid white;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.3s;
            "
            onmouseover="this.style.backgroundColor='white'; this.style.color='#1b1e16'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='white'"
          >
            Déconnexion
          </button>
        </ng-container>
        
        <ng-template #loginButton>
          <button 
            (click)="navigateToLogin()"
            style="
              background-color: #498229;
              border: none;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.3s;
            "
            onmouseover="this.style.backgroundColor='#3a6a1f'"
            onmouseout="this.style.backgroundColor='#498229'"
          >
            Connexion
          </button>
        </ng-template>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
} 