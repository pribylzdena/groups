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
import {AuthorizationService} from '@app/services/authorization.service';

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
  private authService: AuthorizationService;
  groupId: number | null = null;

  groupForm!: FormGroup;
  group!: Group;
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  error = '';
  successMessage = '';

  isLoading = false;
  isSaving = false;
  searchQuery = '';
  showDropdown = false;
  openDropdownId: string | null = null;

  public currentGroupMember: GroupMember | undefined;

  public availableRoles = [
    { value: 'member', label: 'Člen' },
    { value: 'admin', label: 'admin' }
  ];

  constructor(
    fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    groupService: GroupService,
    userService: UserService,
    notificationService: NotificationService,
    authService: AuthorizationService
  ) {
    this.fb = fb;
    this.route = route;
    this.router = router;
    this.groupService = groupService;
    this.userService = userService;
    this.notificationService = notificationService;
    this.authService = authService;

    this.groupForm = this.createForm();

    this.loadData();
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
    this.isLoading = true;

    this.route.parent?.paramMap.subscribe((params) => {
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

        if (!this.group.members) {
          this.group.members = [];
        }

        this.groupForm.patchValue({
          name: this.group.name
        });
        this.isLoading = false;
        this.currentGroupMember = this.group.members.find(m => m.user.id === this.authService.getUserId());

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

  changeUserRole(member: GroupMember, newRole: string): void {
    if (this.currentGroupMember?.role !== 'admin') {
      this.error = 'Nemáte oprávnění měnit role uživatelů';
      return;
    }

    if (member.role === 'admin') {
      this.error = 'Nelze měnit roli admin účtu';
      return;
    }

    const oldRole = member.role;
    member.role = newRole;

    this.successMessage = `Role uživatele ${member.user.name} byla změněna z "${this.getRoleDisplayName(oldRole)}" na "${this.getRoleDisplayName(newRole)}"`;
    this.error = '';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  onRoleChange(member: GroupMember): void {
    this.successMessage = `Role uživatele ${member.user.name} byla změněna na "${this.getRoleDisplayName(member.role)}"`;
    this.error = '';

    // Auto-hide success message
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'member': 'Člen',
      'admin': 'Admin'
    };
    return roleMap[role] || role;

    // TODO do enum
  }

  canChangeRoles(): boolean {
    return this.currentGroupMember?.role === 'admin';
  }

  canChangeUserRole(member: GroupMember): boolean {
    return this.canChangeRoles() && member.role !== 'admin';
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
        this.successMessage = 'Uložení bylo úspěšné';
        this.isSaving = false;

        location.reload();
      },
      error: (error) => {
        console.error('Chyba při ukládání skupiny:', error);
        this.error = 'Nepodařilo se uložit skupinu';
        this.isSaving = false;
      }
    });
  }

  onSearch(): void {
    this.filterUsers();
    this.showDropdown = true;
  }

  leaveGroup(): void {
    this.groupService.leaveGroup(this.group).subscribe({
      next: (response) => {
        this.successMessage = 'Opuštění bylo úspěšné';
        this.isSaving = false;

        this.router.navigate(['/group-manage']);
      },
      error: (error) => {
        console.error('Chyba při opouštění skupiny:', error);
        this.error = 'Nepodařilo se opustit skupinu';
        this.isSaving = false;
      }
    });
  }
}
