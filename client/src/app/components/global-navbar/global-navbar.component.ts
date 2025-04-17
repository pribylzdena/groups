import { Component, HostListener } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {GroupService} from '@app/services/group.service';
import {AuthorizationService} from '@app/services/authorization.service';


@Component({
  selector: 'app-global-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './global-navbar.component.html',
  styleUrl: './global-navbar.component.scss',
  standalone: true
})
export class GlobalNavbarComponent {
  private router: Router;
  private route: ActivatedRoute;
  private groupService: GroupService;
  private authService: AuthorizationService;

  hasNotifications = true;
  notificationCount = 3;
  isDropdownOpen = false;
  isUserOnline = true;
  profileImageUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM2NEI1RjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0UzRjJGRCIvPjxwYXRoIGQ9Ik0yNSA5NUMyNSA3Ni43IDE2LjggNjUgNTAgNjVDODMuMiA2NSA3NSA3Ni43IDc1IDk1IiBmaWxsPSIjRTNGMkZEIi8+PC9zdmc+';
  userName = 'John Smith';
  userEmail = 'john.smith@example.com';

  constructor(router: Router, route: ActivatedRoute, groupService: GroupService, authService: AuthorizationService) {
    this.router = router;
    this.route = route;
    this.groupService = groupService;
    this.authService = authService;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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
