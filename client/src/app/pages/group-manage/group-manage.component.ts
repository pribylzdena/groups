import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Group } from '@app/models/group';
import { GlobalNavbarComponent } from '@components/global-navbar/global-navbar.component';
import { GroupService } from '@app/services/group.service';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-manage.component.html',
  imports: [
    NgForOf,
    RouterLink,
    GlobalNavbarComponent
  ],
  styleUrls: ['./group-manage.component.scss'],
  standalone: true
})
export class GroupManageComponent implements OnInit {
  private groupService: GroupService;
  public groups: Group[];

  constructor(groupService: GroupService) {
    this.groupService = groupService;
    this.groups = this.groupService.getAllGroups();
  }

  ngOnInit(): void {
    this.groupService.getGroupsFromApi().subscribe({
      next: (response) => {
        console.log(response);
        this.groups = response;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  createNewGroup(): void {
  }
}
