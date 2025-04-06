import { Component } from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { Priority } from '@app/enums/priority';
import {of} from 'rxjs';

@Component({
  selector: 'app-schedule-sidebar',
  imports: [
    NgIf,
    NgForOf,
    NgStyle
  ],
  templateUrl: './schedule-sidebar.component.html',
  styleUrl: './schedule-sidebar.component.scss',
  standalone: true
})
export class ScheduleSidebarComponent {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
