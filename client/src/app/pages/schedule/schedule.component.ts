import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScheduleSidebarComponent } from '@components/schedule-sidebar/schedule-sidebar.component';
import { Event } from '@models/event';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import {Note} from '@models/note';
import {EventService} from '@app/services/event.service';

declare var bootstrap: any;

interface DayInfo {
  date: Date;
  day: number;
  shortName: string;
  isToday: boolean;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ScheduleSidebarComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  private route: ActivatedRoute
  private groupService: GroupService
  private eventService: EventService
  groupId: number | null = null;

  currentDate: Date = new Date();
  currentStartDate: Date;
  weekDays: DayInfo[] = [];

  isWeekView: boolean = true;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  events: Event[] = [];
  selectedEvent: Event | null = null;
  private eventModal: any = null;

  constructor(groupService: GroupService, eventService: EventService, route: ActivatedRoute) {
    this.route = route;
    this.groupService = groupService;
    this.eventService = eventService;
    this.loadData();

    this.currentStartDate = this.getStartOfWeek(this.currentDate);
    this.generateWeekDays();
  }

  ngOnInit(): void {
    this.loadData();

    setTimeout(() => {
      const modalElement = document.getElementById('eventDetailModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.eventModal = new bootstrap.Modal(modalElement);
      }
    });
  }

  changeWeek(direction: number): void {
    const newDate = new Date(this.currentStartDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    this.currentStartDate = newDate;
    this.generateWeekDays();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.currentStartDate = this.getStartOfWeek(this.currentDate);
    this.generateWeekDays();
  }

  toggleView(): void {
    this.isWeekView = !this.isWeekView;
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const result = new Date(date);
    result.setDate(date.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  generateWeekDays(): void {
    const daysOfWeek = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    this.weekDays = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentStartDate);
      date.setDate(this.currentStartDate.getDate() + i);

      const isToday = date.getTime() === today.getTime();

      this.weekDays.push({
        date: date,
        day: date.getDate(),
        shortName: daysOfWeek[i],
        isToday: isToday
      });
    }
  }

  getWeekLabel(): string {
    const start = new Date(this.currentStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const startMonth = start.toLocaleDateString('cs-CZ', { month: 'long' });
    const endMonth = end.toLocaleDateString('cs-CZ', { month: 'long' });

    if (startMonth === endMonth) {
      return `${start.getDate()}. - ${end.getDate()}. ${startMonth} ${start.getFullYear()}`;
    } else {
      return `${start.getDate()}. ${startMonth} - ${end.getDate()}. ${endMonth} ${start.getFullYear()}`;
    }
  }

  getEventsForDay(date: Date): Event[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.startsAt);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  }

  calculateEventTop(event: Event): number {
    const startHour = event.startsAt.getHours();
    const startMinute = event.startsAt.getMinutes();
    return (startHour + startMinute / 60) * (100 / 24);
  }

  calculateEventHeight(event: Event): number {
    const startTime = event.startsAt.getTime();
    const endTime = event.endsAt.getTime();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    return durationHours * (100 / 24);
  }

  formatEventTime(event: Event): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const start = event.startsAt.toLocaleTimeString('cs-CZ', options);
    const end = event.endsAt.toLocaleTimeString('cs-CZ', options);
    return `${start} - ${end}`;
  }

  formatEventDateTime(date: Date | undefined): string {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('cs-CZ', options);
  }

  showEventDetail(event: Event): void {
    this.selectedEvent = event;
    if (this.eventModal) {
      this.eventModal.show();
    }
  }

  editEvent(event: Event | null): void {
    if (!event) return;
    console.log('Editing event:', event);
  }

  getStatusClass(status: string | undefined): string {
    /*if (!status)*/ return 'bg-secondary';

    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  loadData() {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = Number(params.get('groupId'));
    });

    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEventsFromApi(this.groupId).subscribe({
      next: (response) => {
        console.log(response);
        this.events = response.map(e => new Event(e.id, e.name, new Date(e.startsAt), new Date(e.endsAt), e.status, e.color, e.participants));
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }
}
