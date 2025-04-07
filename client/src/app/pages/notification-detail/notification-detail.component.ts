import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {GroupService} from '@app/services/group.service';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  templateUrl: './notification-detail.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent {
  protected readonly RouterLinkActive = RouterLinkActive;
}
