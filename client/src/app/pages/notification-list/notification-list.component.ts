import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent {
  notifications = [
    { sender: 'User1', subject: 'example.something@gmail.com', message: 'Group1' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' }
  ];
}
