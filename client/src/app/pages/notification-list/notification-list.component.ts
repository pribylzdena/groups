import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/services/notification.service';
import { Notification } from '@models/notification';
import {NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {GlobalNavbarComponent} from '@components/global-navbar/global-navbar.component';
import {AuthorizationService} from '@app/services/authorization.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    RouterLink,
    FormsModule,
    SlicePipe,
    GlobalNavbarComponent
  ],
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';
  currentTypeFilter: string = 'all';
  sortField: string = 'id';
  sortDirection: string = 'desc';
  notificationTypes: string[] = [];
  currentUserId: number;
  private notificationService: NotificationService;
  private authorizationService: AuthorizationService;

  isLoading = false;

  // Pagination
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(notificationService: NotificationService, http: HttpClient) {
    this.authorizationService = new AuthorizationService(http);
    this.notificationService = notificationService;
    this.currentUserId = this.authorizationService.getUserId();
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;

    this.notificationService.getNotificationsFromApi().subscribe(data => {
      this.notifications = data.map(n => new Notification(n.id, n.name, n.text, n.subject, n.type, n.recipients ?? []));
      // Extract unique notification types
      this.notificationTypes = [...new Set(data.map(item => item.type))];
      this.applyFilters();

      this.isLoading = false;
    });
  }

  applyFilters(): void {
    let result = [...this.notifications];

    // Apply search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(notification =>
        notification.name.toLowerCase().includes(term) ||
        notification.text.toLowerCase().includes(term) ||
        notification.subject.toLowerCase().includes(term)
      );
    }

    // Apply read/unread filter
    if (this.currentFilter === 'unread') {
      result = result.filter(notification => !this.isReadByCurrentUser(notification));
    } else if (this.currentFilter === 'read') {
      result = result.filter(notification => this.isReadByCurrentUser(notification));
    }

    // Apply type filter
    if (this.currentTypeFilter !== 'all') {
      result = result.filter(notification => notification.type === this.currentTypeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (this.sortField === 'id') {
        comparison = a.id - b.id;
      } else if (this.sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (this.sortField === 'subject') {
        comparison = a.subject.localeCompare(b.subject);
      } else if (this.sortField === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    // Calculate pagination
    this.totalPages = Math.ceil(result.length / this.itemsPerPage);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredNotifications = result.slice(startIndex, endIndex);
  }

  filterBy(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  filterByType(type: string): void {
    this.currentTypeFilter = type;
    this.currentPage = 1;
    this.applyFilters();
  }

  sortBy(field: string, direction: string): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currentFilter = 'all';
    this.currentTypeFilter = 'all';
    this.sortField = 'id';
    this.sortDirection = 'desc';
    this.currentPage = 1;
    this.applyFilters();
  }

  isReadByCurrentUser(notification: Notification): boolean {
    const recipient = notification.recipients.find(r => r.user.id === this.currentUserId);
    return recipient ? !!recipient.readAt : false;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.applyFilters();
  }

  getTypeBadgeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'info':
        return 'badge-info';
      case 'warning':
        return 'badge-warning';
      case 'danger':
      case 'error':
        return 'badge-danger';
      case 'success':
        return 'badge-success';
      case 'primary':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  }

  getPaginationRange(): number[] {
    const range = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if there are only a few
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i);
      }
    } else {
      // Otherwise show a window around current page
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Adjust if window is too far to the right
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }

    return range;
  }
}
