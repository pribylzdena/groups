import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Notification } from '@models/notification';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit {
  notification: Notification | undefined;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convert string to number
      if (id) {
        this.loadNotification(id);
      }
    });
  }

  loadNotification(id: number): void {
    this.notificationService.getNotification(id).subscribe({
      next: (data) => {
        this.notification = data;
      },
      error: (error) => {
        console.error('Error loading notification:', error);
      }
    });
  }

  getNotificationColor(): string {
    // Map notification types to colors
    const colorMap: {[key: string]: string} = {
      'info': '#3498db',
      'warning': '#f39c12',
      'success': '#2ecc71',
      'danger': '#e74c3c',
      'primary': '#34698d'
    };

    return this.notification?.type ? colorMap[this.notification.type] || '#3498db' : '#3498db';
  }

  getNotificationBadgeClass(): string {
    return this.notification?.type ? 'bg-' + this.notification.type : 'bg-info';
  }

  getReadCount(): number {
    if (!this.notification?.recipients) return 0;
    return this.notification.recipients.filter(recipient => recipient.readAt).length;
  }
}
