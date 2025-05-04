import {Component, Input} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '@app/services/event.service';
import {Task} from '@models/task';


@Component({
  selector: 'app-schedule-sidebar',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './schedule-sidebar.component.html',
  styleUrl: './schedule-sidebar.component.scss',
  standalone: true
})
export class ScheduleSidebarComponent {
  @Input() groupId: number;

  private fb: FormBuilder;
  private eventService: EventService;

  isOpen = false;
  eventColor = '#3498db';
  eventForm: FormGroup;
  dateError = '';

  constructor(fb: FormBuilder, eventService: EventService) {
    this.fb = fb;
    this.eventService = eventService;
    this.initForm();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      eventColor: [this.eventColor, Validators.required],
      eventName: ['', Validators.required],
      eventStart: ['', Validators.required],
      eventEnd: ['', Validators.required],
      eventDescription: [''],
      eventPriority: ['medium', Validators.required]
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.dateError = '';
      this.initForm();
    }
  }

  createSchedule(event: Event) {
    event.preventDefault();

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

    console.log('Creating new schedule event');
    console.log('Color selected:', this.eventColor);
    console.log('Form submitted');
    console.log(event);

    console.log(this.groupId);

    this.eventService.createEvent(event, this.groupId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Chyba API:', error);
      }
    });

    this.toggleSidebar();
    window.location.reload();
  }

  validateDates(): boolean {``
    const startDate = new Date(this.eventForm.get('eventStart')?.value);
    const endDate = new Date(this.eventForm.get('eventEnd')?.value);

    if (endDate < startDate) {
      this.dateError = 'Koncové datum nemůže být před datem začátku';
      return false;
    }

    this.dateError = '';
    return true;
  }
}
