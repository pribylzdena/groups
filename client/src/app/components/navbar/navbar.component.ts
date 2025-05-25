import {Component, Input, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '@app/services/group.service';
import {NgIf} from '@angular/common';
import {AuthorizationService} from '@app/services/authorization.service';
import {Group} from '@models/group';
import {UserService} from '@app/services/user.service';
import {User} from '@models/user';
import {NotificationService} from '@app/services/notification.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent implements OnInit{
  private router: Router;
  private route: ActivatedRoute;
  private groupService: GroupService;
  private authService: AuthorizationService;
  private userService: UserService;
  private notificationService: NotificationService;

  @Input() public group: Group;

  public user: User;

  hasNotifications = true;
  notificationCount = 0;
  isDropdownOpen = false;
  isUserOnline = true;
  logoUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM2NEI1RjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0UzRjJGRCIvPjxwYXRoIGQ9Ik0yNSA5NUMyNSA3Ni43IDE2LjggNjUgNTAgNjVDODMuMiA2NSA3NSA3Ni43IDc1IDk1IiBmaWxsPSIjRTNGMkZEIi8+PC9zdmc+';

  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(router: Router, route: ActivatedRoute, authService: AuthorizationService, userService: UserService, notificationService: NotificationService) {
    this.router = router;
    this.route = route;
    this.authService = authService;
    this.userService = userService;
    this.notificationService = notificationService;

    this.loadUser();
    this.loadNotificaitonCount();
  }

  ngOnInit() {
    this.loadUser();
    if (this.user.logoUrl) this.logoUrl = this.user.logoUrl;
    this.loadNotificaitonCount();
  }

  loadNotificaitonCount() {
    console.log("load ntf");
    this.notificationService.getUnreadNotificationCount().subscribe({
      next: (response) => {
        this.notificationCount = response;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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

  logout() {

    this.authService.logout();
    setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000
    )

    console.log('logging out');
  }
}

