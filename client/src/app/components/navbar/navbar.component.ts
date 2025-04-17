import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '@app/services/group.service';
import {NgIf} from '@angular/common';
import {AuthorizationService} from '@app/services/authorization.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent {
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
  groupId: number | null = null;
  groupName: string | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(router: Router, route: ActivatedRoute, groupService: GroupService, authService: AuthorizationService) {
    this.router = router;
    this.route = route;
    this.groupService = groupService;
    this.authService = authService;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.groupId = Number(params.get('groupId'));
      const group = this.groupId ? this.groupService.getGroupById(this.groupId) : null;
      this.groupName = group?.name ?? null;
    });
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

