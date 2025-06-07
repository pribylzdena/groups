import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '@app/services/user.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {User} from '@models/user';
import {GlobalNavbarComponent} from '@components/global-navbar/global-navbar.component';
import { NotificationType } from '@enums/notification-type';
import {GroupService} from '@app/services/group.service';
import {Group} from '@models/group';
import {NgForOf, NgIf} from '@angular/common';
import { Notification } from '@models/notification';
import {NotificationRecipient} from '@models/notification-recipient';
import {NotificationService} from '@app/services/notification.service';

@Component({
  selector: 'app-notification-create',
  imports: [
    RouterLink,
    GlobalNavbarComponent,
    NgForOf,
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './notification-create.component.html',
  styleUrl: './notification-create.component.scss',
  standalone: true
})
export class NotificationCreateComponent implements OnInit{
  private userService: UserService;
  private groupService: GroupService;
  private notificationService: NotificationService;
  private fb: FormBuilder;
  private router: Router;

  allUsers: User[] = [];
  filteredUsers: User[] = [];
  recipients: User[] = [];

  allGroups: Group[] = [];
  filteredGroups: Group[] = [];
  targetGroup: Group | undefined;

  isLoading = false;
  groupSearchQuery = '';
  userSearchQuery = '';
  showUserDropdown = false;
  showGroupDropdown = false;
  notificationForm: FormGroup;

  notificationTypes = NotificationType.getAllNames();

  constructor(userService: UserService, fb: FormBuilder, groupService: GroupService, router: Router, notificationService: NotificationService) {
    this.fb = fb;
    this.userService = userService;
    this.groupService = groupService;
    this.notificationService = notificationService;
    this.router = router;

    this.initForm();
  }

  private initForm(): void {
    this.notificationForm = this.fb.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      type: ['', [Validators.required]],
      text: ['', [Validators.required]],
      recipients: this.fb.array([], [Validators.minLength(1)])
    });
  }

  loadData() {
    this.loadUsers();
    this.loadGroups();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userService.getUsersFromApi().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chyba při načítání uživatelů:', error);
      }
    });
  }

  loadGroups(): void {
    this.isLoading = true;

    this.groupService.getGroupsFromApi().subscribe({
      next: (groups) => {
        this.allGroups = groups;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chyba při načítání uživatelů:', error);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Close user dropdown if clicked outside
    if (!target.closest('.input-group') && !target.closest('.dropdown-menu')) {
      this.showUserDropdown = false;
      this.showGroupDropdown = false;
    }
  }

  filterUsers(): void {
    if (!this.userSearchQuery.trim()) {
      this.filteredUsers = [];
      return;
    }

    const query = this.userSearchQuery.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    ).filter(user =>
      !this.isRecipient(user.id)
    );
  }

  isRecipient(userId: number): boolean {
    return this.recipients?.some(r => r.id === userId) || false;
  }

  filterGroups(): void {
    if (!this.groupSearchQuery.trim()) {
      this.filteredGroups = [];
      return;
    }

    const query = this.groupSearchQuery.toLowerCase();
    this.filteredGroups = this.allGroups.filter(group =>
      group.name.toLowerCase().includes(query)
    ).filter(group =>
      !this.isTargetGroup(group.id)
    );
  }

  isTargetGroup(groupId: number): boolean {
    return this.targetGroup?.id === groupId;
  }

  onUserSearch(): void {
    this.filterUsers();
    this.showUserDropdown = true;
  }

  onGroupSearch(): void {
    this.filterGroups();
    this.showGroupDropdown = true;
  }

  addRecipient(user: User): void {
    if (!this.isRecipient(user.id)) {
      this.recipients.push(user);
      this.updateRecipientsFormArray();
      this.userSearchQuery = '';
      this.filteredUsers = [];
      this.showUserDropdown = false;
    }
  }

  removeRecipient(user: User): void {
    this.recipients = this.recipients.filter(r => r.id !== user.id);
    this.updateRecipientsFormArray();
  }

  updateRecipientsFormArray(): void {
    const recipientsFormArray = this.notificationForm.get('recipients') as FormArray;
    recipientsFormArray.clear();

    this.recipients.forEach(user => {
      recipientsFormArray.push(new FormControl(user.id));
    });
  }

  selectGroup(group: Group): void {
    this.targetGroup = group;

    if (group.members && group.members.length > 0) {
      const groupUserIds = new Set(group.members.map(member => member.user?.id).filter(id => id !== undefined));

      const groupUsers = this.allUsers.filter(user => groupUserIds.has(user.id));

      groupUsers.forEach(user => {
        if (!this.isRecipient(user.id)) {
          this.recipients.push(user);
        }
      });

      this.updateRecipientsFormArray();
    }

    this.groupSearchQuery = '';
    this.filteredGroups = [];
    this.showGroupDropdown = false;
  }

  removeGroup(): void {
    this.targetGroup = undefined;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.notificationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  sendNotification() {
    if (this.notificationForm.invalid) {
      Object.keys(this.notificationForm.controls).forEach(key => {
        const control = this.notificationForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const notificationRecipients: NotificationRecipient[] = this.recipients.map(
      user => new NotificationRecipient(0, user)
    );

    const notification = new Notification(
      0,
      this.notificationForm.get('name')?.value,
      this.notificationForm.get('text')?.value,
      this.notificationForm.get('subject')?.value,
      this.notificationForm.get('type')?.value,
      notificationRecipients
    );

    console.log('Sending notification:', notification);

    this.notificationService.createNotification(notification).subscribe({
      next: (response) => {
        this.router.navigate(['/notifications']);
      },
      error: (error) => {
        console.error('Error creating notification:', error);
      }
    });

    this.router.navigate(['/notifications']);
  }

}
