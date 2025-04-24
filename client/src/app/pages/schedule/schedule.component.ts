// schedule.component.ts
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScheduleSidebarComponent } from '@components/schedule-sidebar/schedule-sidebar.component';
import { Event } from '@models/event';

// Definice typu pro Bootstrap Modal, aby fungoval i při SSR
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
  // Aktuální den a týden
  currentDate: Date = new Date();
  currentStartDate: Date;
  weekDays: DayInfo[] = [];

  // Nastavení pohledu
  isWeekView: boolean = true;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  // Data událostí
  events: Event[] = [];
  selectedEvent: Event | null = null;

  // Reference na modální okno
  private eventModal: any = null;

  // Indikátor zda jsme v prohlížeči nebo na serveru
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Zjištění, zda jsme v prohlížeči
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Inicializace počátečního data týdne
    this.currentStartDate = this.getStartOfWeek(this.currentDate);
    this.generateWeekDays();
  }

  ngOnInit(): void {
    // Ukázkové naplnění událostmi - v produkci bychom získali data z API
    this.loadDemoEvents();

    // Inicializace modálního okna pouze v prohlížeči
    if (this.isBrowser) {
      setTimeout(() => {
        const modalElement = document.getElementById('eventDetailModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
          this.eventModal = new bootstrap.Modal(modalElement);
        }
      });
    }
  }

  /**
   * Změna aktuálního týdne
   */
  changeWeek(direction: number): void {
    const newDate = new Date(this.currentStartDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    this.currentStartDate = newDate;
    this.generateWeekDays();
  }

  /**
   * Přechod na aktuální den
   */
  goToToday(): void {
    this.currentDate = new Date();
    this.currentStartDate = this.getStartOfWeek(this.currentDate);
    this.generateWeekDays();
  }

  /**
   * Přepínání mezi týdenním a měsíčním pohledem
   */
  toggleView(): void {
    this.isWeekView = !this.isWeekView;
    // Tady by byla implementace změny pohledu
  }

  /**
   * Získání prvního dne v týdnu (pondělí) pro dané datum
   */
  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 = neděle, 1 = pondělí, ...
    const diff = day === 0 ? 6 : day - 1; // Převod na 0 = pondělí, ...
    const result = new Date(date);
    result.setDate(date.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Vytvoření pole dnů v aktuálním týdnu
   */
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

  /**
   * Formátování textového popisu týdne
   */
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

  /**
   * Získání událostí pro konkrétní den
   */
  getEventsForDay(date: Date): Event[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.startsAt);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  }

  /**
   * Výpočet pozice události v kalendáři (%) podle času začátku
   */
  calculateEventTop(event: Event): number {
    const startHour = event.startsAt.getHours();
    const startMinute = event.startsAt.getMinutes();
    return (startHour + startMinute / 60) * (100 / 24);
  }

  /**
   * Výpočet výšky události v kalendáři (%) podle délky trvání
   */
  calculateEventHeight(event: Event): number {
    const startTime = event.startsAt.getTime();
    const endTime = event.endsAt.getTime();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    return durationHours * (100 / 24);
  }

  /**
   * Formátování času události
   */
  formatEventTime(event: Event): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const start = event.startsAt.toLocaleTimeString('cs-CZ', options);
    const end = event.endsAt.toLocaleTimeString('cs-CZ', options);
    return `${start} - ${end}`;
  }

  /**
   * Formátování data a času události
   */
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

  /**
   * Zobrazení detailu události
   */
  showEventDetail(event: Event): void {
    this.selectedEvent = event;
    if (this.isBrowser && this.eventModal) {
      this.eventModal.show();
    }
  }

  /**
   * Editace události
   */
  editEvent(event: Event | null): void {
    if (!event) return;
    // Implementace editace události
    console.log('Editing event:', event);
    // Tady by bylo volání modálního okna pro editaci nebo přesměrování na stránku editace
  }

  /**
   * Získání CSS třídy pro stav události
   */
  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';

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

  /**
   * Načtení ukázkových dat pro demonstraci
   */
  private loadDemoEvents(): void {
    // Implementace načtení událostí z API
    // Pro ukázku vytvoříme několik událostí

    // Dnešní datum pro ukázku
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);

    // Ukázkové události - v produkční verzi by se načítaly ze serveru
    this.events = [
      new Event(
        1,
        'Porada týmu',
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 9, 0),
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 10, 30),
        'confirmed',
        '#4285F4',
        []
      ),
      new Event(
        2,
        'Oběd s klientem',
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 12, 0),
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 1, 13, 30),
        'confirmed',
        '#EA4335',
        []
      ),
      new Event(
        3,
        'Prezentace projektu',
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 14, 0),
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 2, 16, 0),
        'pending',
        '#FBBC05',
        []
      ),
      new Event(
        4,
        'Školení',
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 10, 0),
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 3, 17, 0),
        'confirmed',
        '#34A853',
        []
      ),
      new Event(
        5,
        'Teambuilding',
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 16, 0),
        new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 4, 22, 0),
        'confirmed',
        '#9C27B0',
        []
      )
    ];
  }
}
