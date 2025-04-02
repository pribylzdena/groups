import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent {
  showDetails = true;

  hideDetailsPage() {
    this.showDetails = false;
  }
}
