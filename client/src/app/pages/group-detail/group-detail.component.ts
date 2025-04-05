import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-detail.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent {
  groups = [
    { name: 'Group1', members: 95 },
    { name: 'Group2', members: 945 },
    { name: 'Group3', members: 9 },
    { name: 'Group4', members: 5 },
    { name: 'Group4', members: 6 },
  ];
}
