import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-task-sidebar',
  templateUrl: './task-sidebar.component.html',
  styleUrls: ['./task-sidebar.component.scss'],
  imports: [
    NgIf
  ],
  standalone: true
})
export class TaskSidebarComponent {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
