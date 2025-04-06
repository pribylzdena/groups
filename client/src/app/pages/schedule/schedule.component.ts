import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  currentStartDate = new Date(2025, 2, 17); // March is month 2 (zero-based)
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  changeWeek(direction: number) {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + direction * 7);
  }

  getWeekLabel(): string {
    const start = new Date(this.currentStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
}
