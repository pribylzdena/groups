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
export class NotificationDetailComponent implements OnInit{
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
