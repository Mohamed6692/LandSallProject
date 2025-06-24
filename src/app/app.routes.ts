import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Exemple : import des routes du module auth
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { LandListComponent } from './features/lands/land-list/land-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lands/list',
    loadComponent: () => import('./features/lands/land-list/land-list.component').then(m => m.LandListComponent)
  },
  // d'autres routes
];
