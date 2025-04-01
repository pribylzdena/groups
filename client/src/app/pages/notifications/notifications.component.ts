import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifications = [
    { sender: 'User1', subject: 'example.something@gmail.com', message: 'Group1' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' }
  ];
}
