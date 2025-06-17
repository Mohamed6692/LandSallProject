import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
      <h1 style="color: #1b1e16; margin-bottom: 2rem;">Tableau de bord</h1>
      
      <div *ngIf="currentUser$ | async as user" style="
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
      ">
        <h2 style="color: #498229; margin-bottom: 1rem;">Informations utilisateur</h2>
        <div style="display: grid; gap: 0.5rem;">
          <p><strong>Nom complet:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Rôle:</strong> {{ user.role }}</p>
        </div>
      </div>

      <div style="
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
      ">
        <h2 style="color: #498229; margin-bottom: 1rem;">Actions disponibles</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <button style="
            background-color: #498229;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          " onmouseover="this.style.backgroundColor='#3a6a1f'" onmouseout="this.style.backgroundColor='#498229'">
            Gérer les terrains
          </button>
          <button style="
            background-color: #1b1e16;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          " onmouseover="this.style.backgroundColor='#2a2f1f'" onmouseout="this.style.backgroundColor='#1b1e16'">
            Voir les réservations
          </button>
          <button style="
            background-color: #498229;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          " onmouseover="this.style.backgroundColor='#3a6a1f'" onmouseout="this.style.backgroundColor='#498229'">
            Messages
          </button>
        </div>
      </div>

      <!-- Bouton de test pour la déconnexion -->
      <div style="
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      ">
        <h3 style="color: #6c757d; margin-bottom: 1rem;">Test de déconnexion</h3>
        <button 
          (click)="testLogout()"
          style="
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          "
          onmouseover="this.style.backgroundColor='#c82333'"
          onmouseout="this.style.backgroundColor='#dc3545'"
        >
          Tester la déconnexion
        </button>
        <p style="margin-top: 0.5rem; color: #6c757d; font-size: 0.9rem;">
          Utilisez ce bouton pour tester le processus de déconnexion et reconnexion.
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser$;

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
} 