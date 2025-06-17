import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationMessage } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="currentNotification" 
      class="notification"
      [class]="'notification--' + currentNotification.type"
      [@slideInOut]
    >
      <div class="notification__content">
        <span class="notification__message">{{ currentNotification.message }}</span>
        <button class="notification__close" (click)="close()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      min-width: 300px;
      max-width: 400px;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    }

    .notification__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .notification__message {
      flex: 1;
      margin-right: 1rem;
    }

    .notification__close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .notification__close:hover {
      opacity: 1;
    }

    .notification--success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .notification--error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .notification--info {
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
    }

    .notification--warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  currentNotification: NotificationMessage | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => {
        this.currentNotification = notification;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.notificationService.clear();
  }
} 