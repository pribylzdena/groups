import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {NotificationListComponent} from '@app/pages/notification-list/notification-list.component';
import {Group} from '@models/group';
import {GroupService} from '@app/services/group.service';

@Component({
  selector: 'app-group-layout',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NotificationListComponent
  ],
  standalone: true
})
export class GroupComponent implements OnInit {
  private route: ActivatedRoute;
  private groupService: GroupService;

  groupId: number | null = null;
  group: Group;
  constructor(route: ActivatedRoute, groupService: GroupService) {
    this.route = route;
    this.groupService = groupService;
    this.loadData();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = Number(params.get('groupId'));
    });

    this.loadGroup();
  }

  loadGroup() {
    this.groupService.getGroupFromApi(this.groupId).subscribe({
      next: (response) => {
        this.group = response.map(n => new Group(n.id, n.name, n.members ?? []));
        console.log(this.group);
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }
}
