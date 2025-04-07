import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import {NavbarComponent} from '@components/navbar/navbar.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent {
  protected readonly RouterLinkActive = RouterLinkActive;

  notifications = [
    { sender: 'User1', subject: 'example.something@gmail.com', message: 'Group1' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' }
  ];
}
