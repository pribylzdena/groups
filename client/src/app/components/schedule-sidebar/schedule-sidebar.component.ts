import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { EventService } from '@app/services/event.service';
import { Event } from '@models/event';
import {UserService} from '@app/services/user.service';
import {User} from '@models/user';
import {EventParticipant} from '@models/event-participant';


@Component({
  selector: 'app-schedule-sidebar',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  templateUrl: './schedule-sidebar.component.html',
  styleUrl: './schedule-sidebar.component.scss',
  standalone: true
})
export class ScheduleSidebarComponent {
  @Input() groupId: number;

  event: Event;

  private fb: FormBuilder;
  private eventService: EventService;
  private userService: UserService;

  allUsers: User[] = [];
  filteredUsers: User[] = [];

  isOpen = false;
  eventColor = '#3498db';
  eventForm: FormGroup;
  dateError = '';
  searchQuery = '';
  showDropdown = false;

  constructor(fb: FormBuilder, eventService: EventService, userService: UserService) {
    this.fb = fb;
    this.eventService = eventService;
    this.userService = userService;

    this.initForm();

    this.event = new Event(
      0,
      this.eventForm.get('eventName')?.value,
      this.eventForm.get('eventStart')?.value,
      this.eventForm.get('eventEnd')?.value,
      1,
      this.eventForm.get('eventColor')?.value,
      this.event?.participants || []
    );
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      eventColor: [this.eventColor, Validators.required],
      eventName: ['', Validators.required],
      eventStart: ['', Validators.required],
      eventEnd: ['', Validators.required],
      eventDescription: [''],
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.dateError = '';
      this.initForm();
      this.loadUsers();
    }
  }

  createSchedule() {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsDirty();
        control?.markAsTouched();
      });
      return;
    }

    if (!this.validateDates()) {
      return;
    }

    this.event = new Event(
      0,
      this.eventForm.get('eventName')?.value,
      this.eventForm.get('eventStart')?.value,
      this.eventForm.get('eventEnd')?.value,
      1,
      this.eventForm.get('eventColor')?.value,
      this.event?.participants || []
    );

    console.log(this.event);

    this.eventService.createEvent(this.event, this.groupId).subscribe({
      next: (response) => {
        console.log(response);
        this.event = response;
      },
      error: (error) => {
        console.error('Chyba API:', error);
      }
    });

    this.toggleSidebar();
    window.location.reload();
  }

  validateDates(): boolean {
    const startDate = new Date(this.eventForm.get('eventStart')?.value);
    const endDate = new Date(this.eventForm.get('eventEnd')?.value);

    if (endDate < startDate) {
      this.dateError = 'Koncové datum nemůže být před datem začátku';
      return false;
    }

    this.dateError = '';
    return true;
  }

  loadUsers(): void {
    this.userService.getUsersForCurrentGroup(this.groupId).subscribe({
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
      !this.isUserInEvent(user.id)
    );
  }

  isUserInEvent(userId: number): boolean {
    return this.event?.participants?.some(participant => participant.id === userId) || false;
  }

  addUserToEvent(user: User): void {
    if (!this.event) {
      return;
    }

    if (!this.event.participants) {
      this.event.participants = [];
    }

    if (!this.isUserInEvent(user.id)) {
      this.event.participants.push(new EventParticipant(0, false, user));
    }

    this.searchQuery = '';
    this.filteredUsers = [];
    this.showDropdown = false;
  }

  removeUserFromEvent(user: User): void {
    if (!this.event?.participants) {
      return;
    }

    const index = this.event.participants.findIndex(p => p.user.id === user.id);
    if (index !== -1) {
      this.event.participants.splice(index, 1);
    }
  }

  onSearch(): void {
    this.filterUsers();
    this.showDropdown = true;
  }
}
