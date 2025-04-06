import { Component } from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { Priority } from '@app/enums/priority';
import {of} from 'rxjs';

@Component({
  selector: 'app-task-sidebar',
  templateUrl: './task-sidebar.component.html',
  styleUrls: ['./task-sidebar.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    NgStyle
  ],
  standalone: true
})
export class TaskSidebarComponent {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  protected readonly of = of;
  priorities = Object.entries(Priority);
  selectedPriority: string = 'Medium';
}
