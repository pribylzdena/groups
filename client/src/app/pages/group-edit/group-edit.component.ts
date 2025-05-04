import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Group } from '@models/group';
import { GroupMember } from '@models/group-member';
import { User } from '@models/user';

import { GroupService } from '@app/services/group.service';
import { UserService } from '@app/services/user.service';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.scss'
})
export class GroupEditComponent implements OnInit {
  private fb: FormBuilder;
  private route: ActivatedRoute;
  private router: Router;
  private groupService: GroupService;
  private userService: UserService;
  private notificationService: NotificationService;
  groupId: number | null = null;

  groupForm!: FormGroup; // Using non-null assertion to fix initialization error
  group!: Group; // Using non-null assertion
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  isLoading = false;
  isSaving = false;
  searchQuery = '';
  showDropdown = false;

  constructor(
    fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    groupService: GroupService,
    userService: UserService,
    notificationService: NotificationService
  ) {
    this.fb = fb;
    this.route = route;
    this.router = router;
    this.groupService = groupService;
    this.userService = userService;
    this.notificationService = notificationService;

    // Initialize the form here
    this.groupForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  loadData() {
    this.isLoading = true; // Set loading state

    this.route.paramMap.subscribe((params) => {
      this.groupId = Number(params.get('groupId'));

      if (this.groupId) {
        this.loadGroup();
      }
    });

    this.loadUsers();
  }

  loadGroup() {
    if (!this.groupId) return;

    this.groupService.getGroupFromApi(this.groupId).subscribe({
      next: (response) => {
        this.group = response;
        // Update form with group data
        this.groupForm.patchValue({
          name: this.group.name
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsersFromApi().subscribe({
      next: (users) => {
        this.allUsers = users;
      },
      error: (error) => {
        console.error('Chyba při načítání uživatelů:', error);
      }
    });
  }

  filterUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    ).filter(user =>
      !this.isUserInGroup(user.id)
    );
  }

  isUserInGroup(userId: number): boolean {
    return this.group?.members?.some(member => member.user.id === userId) || false;
  }

  addUserToGroup(user: User): void {
    if (!this.group.members) {
      this.group.members = [];
    }

    if (!this.isUserInGroup(user.id)) {
      const newMember = new GroupMember(0, 'member', user);
      this.group.members.push(newMember);
    }
    this.searchQuery = '';
    this.filteredUsers = [];
    this.showDropdown = false;
  }

  removeUserFromGroup(member: GroupMember): void {
    const index = this.group.members.findIndex(m => m.user.id === member.user.id);
    if (index !== -1) {
      this.group.members.splice(index, 1);
    }
  }

  saveGroup(): void {
    if (this.groupForm.invalid) {
      Object.keys(this.groupForm.controls).forEach(key => {
        const control = this.groupForm.get(key);
        control?.markAsDirty();
        control?.markAsTouched();
      });
      return;
    }

    this.group.name = this.groupForm.value.name;
    this.isSaving = true;

    this.groupService.updateGroup(this.group).subscribe({
      next: (savedGroup) => {
        this.router.navigate(['/groups/' + this.groupId + '/todo']);
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Chyba při ukládání skupiny:', error);
        this.isSaving = false;
      }
    });
  }

  onSearch(): void {
    this.filterUsers();
    this.showDropdown = true;
  }

  cancel(): void {
    this.router.navigate(['/groups/' + this.groupId + '/todo']);
  }
}
