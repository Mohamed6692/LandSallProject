import { TuiRoot } from "@taiga-ui/core";
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, NavbarComponent, NotificationComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'land-sales-app';
  showNavbar = true;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateNavbarVisibility();
    });

    // Vérifier l'état initial
    this.updateNavbarVisibility();
  }

  private updateNavbarVisibility(): void {
    const currentPath = this.location.path();
    // Masquer la navbar sur les routes d'authentification
    this.showNavbar = !currentPath.startsWith('/auth');
  }
}
