import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationMessage | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration: number = 5000): void {
    this.showNotification({ message, type: 'success', duration });
  }

  showError(message: string, duration: number = 5000): void {
    this.showNotification({ message, type: 'error', duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.showNotification({ message, type: 'info', duration });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.showNotification({ message, type: 'warning', duration });
  }

  private showNotification(notification: NotificationMessage): void {
    this.notificationSubject.next(notification);
    
    if (notification.duration) {
      setTimeout(() => {
        this.clear();
      }, notification.duration);
    }
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
} 