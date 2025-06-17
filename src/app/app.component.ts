import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, NavbarComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'land-sales-app';
}
