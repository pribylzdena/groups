import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Group} from '@app/models/group';
import { GlobalNavbarComponent } from '@components/global-navbar/global-navbar.component';

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
export class GroupManageComponent {
  groups: Group[] = [
    { id: 1, name: 'Group1', members: 95 },
    { id: 2, name: 'Group2', members: 945 },
    { id: 3, name: 'Group3', members: 9 },
    { id: 4, name: 'Group4', members: 5 }
  ];

  createNewGroup() : void {

  }
}
