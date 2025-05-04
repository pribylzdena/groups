import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {NotificationListComponent} from '@app/pages/notification-list/notification-list.component';
import {Group} from '@models/group';
import {GroupService} from '@app/services/group.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-group-layout',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NotificationListComponent,
    NgIf
  ],
  standalone: true
})
export class GroupComponent implements OnInit {
  private route: ActivatedRoute;
  private groupService: GroupService;

  groupId: number | null = null;
  group: Group;
  isLoading: boolean = true;

  constructor(route: ActivatedRoute, groupService: GroupService) {
    this.route = route;
    this.groupService = groupService;
    this.loadData();
  }

  ngOnInit(): void {
    this.isLoading = true;

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
        this.group = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
        this.isLoading = false;
      }
    });
  }
}
