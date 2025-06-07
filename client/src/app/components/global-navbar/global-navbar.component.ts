import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {GroupService} from '@app/services/group.service';
import {AuthorizationService} from '@app/services/authorization.service';
import {User} from '@models/user';
import {UserService} from '@app/services/user.service';
import {NotificationService} from '@app/services/notification.service';


@Component({
  selector: 'app-global-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './global-navbar.component.html',
  styleUrl: './global-navbar.component.scss',
  standalone: true
})
export class GlobalNavbarComponent implements OnInit {
  private router: Router;
  private route: ActivatedRoute;
  private groupService: GroupService;
  private authService: AuthorizationService;
  private userService: UserService;
  private notificationService: NotificationService;

  hasNotifications = true;
  notificationCount = 0;
  isDropdownOpen = false;
  isUserOnline = true;
  logoUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM2NEI1RjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0UzRjJGRCIvPjxwYXRoIGQ9Ik0yNSA5NUMyNSA3Ni43IDE2LjggNjUgNTAgNjVDODMuMiA2NSA3NSA3Ni43IDc1IDk1IiBmaWxsPSIjRTNGMkZEIi8+PC9zdmc+';

  public user: User;

  constructor(router: Router, route: ActivatedRoute, groupService: GroupService, authService: AuthorizationService, userService: UserService, notificationService: NotificationService) {
    this.router = router;
    this.route = route;
    this.groupService = groupService;
    this.authService = authService;
    this.userService = userService;
    this.notificationService = notificationService;
    this.loadUser();
    this.loadNotificaitonCount();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit() {
    this.loadUser();
    if (this.user.logoUrl) this.logoUrl = this.user.logoUrl;
    this.loadNotificaitonCount();
  }

  loadUser() {
    this.userService.getUserFromApi().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  loadNotificaitonCount() {
    this.notificationService.getUnreadNotificationCount().subscribe({
      next: (response) => {
        this.notificationCount = response;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  logout() {

    this.authService.logout();
    setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000
    )

  }
}
