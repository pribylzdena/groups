import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {NotificationListComponent} from '@app/pages/notification-list/notification-list.component';

@Component({
  selector: 'app-group-layout',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  imports: [
    RouterOutlet,
    NavbarComponent,
    NotificationListComponent
  ],
  standalone: true
})
export class GroupComponent implements OnInit {
  groupId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('groupId');
    });
  }
}
