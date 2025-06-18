import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Rafraîchir l'état d'authentification au démarrage
    this.authService.refreshAuthState();
  }

  logout(): void {
    console.log('Déconnexion en cours...');
    this.authService.logout();
    console.log('Déconnexion terminée, redirection vers login...');
    this.router.navigate(['/auth/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
} 