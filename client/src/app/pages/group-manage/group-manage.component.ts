import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { RouterLink } from '@angular/router';
import { Group } from '@app/models/group';
import { GlobalNavbarComponent } from '@components/global-navbar/global-navbar.component';
import { GroupService } from '@app/services/group.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-manage.component.html',
  imports: [
    NgForOf,
    RouterLink,
    GlobalNavbarComponent,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./group-manage.component.scss'],
  standalone: true
})
export class GroupManageComponent implements OnInit {
  private groupService: GroupService;
  public groups: Group[];
  public showModal = false;
  public newGroupName = '';
  public showValidationError = false;
  public isSubmitting = false;

  constructor(groupService: GroupService) {
    this.groupService = groupService;
    this.groups = this.groupService.getAllGroups();
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroupsFromApi().subscribe({
      next: (response) => {
        console.log(response);
        this.groups = response.map(n => new Group(n.id, n.name, n.members ?? []));
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.newGroupName = '';
      this.showValidationError = false;
    }
  }

  createGroup(): void {
    if (!this.newGroupName || this.newGroupName.length < 3) {
      this.showValidationError = true;
      return;
    }

    this.showValidationError = false;
    this.isSubmitting = true;

    this.groupService.createGroup(this.newGroupName).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadGroups();
        this.toggleModal();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Chyba při vytváření skupiny:', error);
      }
    });
  }
}
