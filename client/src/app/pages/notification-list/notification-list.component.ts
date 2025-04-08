import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {GroupService} from '@app/services/group.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent {
  notifications = [
    { sender: 'User1', subject: 'example.something@gmail.com', message: 'Group1' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' },
    { sender: 'System', subject: 'dev@groups.cz', message: 'Warning' }
  ];


  groupId: string | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = params.get('groupId');
    });
  }
}
