import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Notification } from '@models/notification';
import { NotificationService } from '@app/services/notification.service';
import {GlobalNavbarComponent} from '@components/global-navbar/global-navbar.component';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    GlobalNavbarComponent
  ],
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit {
  private id: number | null = null;
  notification: Notification | undefined;

  private read = false;

  private route: ActivatedRoute;
  private notificationService: NotificationService;

  constructor(route: ActivatedRoute, notificationService: NotificationService) {
    this.route = route;
    this.notificationService = notificationService;

    this.loadData();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadNotification(id: number): void {
    this.notificationService.getNotificationFromApi(id).subscribe({
      next: (data) => {
        this.notification = data;

        if (this.notification) {
          this.readNotification();
        }

        },
      error: (error) => {
        console.error('Error loading notification:', error);
      }
    });
  }

  readNotification() {
    this.notificationService.readNotification(this.notification).subscribe({
      next: (data) => {
        console.log("successfully read notification")
      },
      error: (error) => {
        console.error('Error reading notification:', error);
      }
    });
  }

  loadData() {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));

      if (this.id) {
        this.loadNotification(this.id);
      }
    });

    if (!this.read && this.id) {
      this.loadNotification(this.id);
    }
  }

  getNotificationColor(): string {
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
