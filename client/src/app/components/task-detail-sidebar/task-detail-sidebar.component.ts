import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit} from '@angular/core';
import { Task } from '@models/task';
import { User } from '@models/user';
import { DatePipe, NgClass, NgIf, NgStyle, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-detail-sidebar',
  imports: [NgStyle, DatePipe, NgClass, NgIf, NgFor, FormsModule],
  templateUrl: './task-detail-sidebar.component.html',
  styleUrl: './task-detail-sidebar.component.scss',
  standalone: true
})
export class TaskDetailSidebarComponent implements OnInit{
  @Input() task: Task | null = null;
  @Output() taskChanged = new EventEmitter<Task>();

  isSidebarOpen: boolean = false;
  editableDatetime: string = '';
  editableReminderDatetime: string = '';
  showReminderInput = false;
  showAssigneeSelector = false;
  isCreateMode = false;

  availableColors: string[] = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#16a085', '#d35400'
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  saveTask() {
    if (!this.task) {
      console.error('No task available to save');
      return;
    }

    if (this.editableDatetime) {
      this.task.deadline = new Date(this.editableDatetime);
    }

    if (this.showReminderInput && this.editableReminderDatetime) {
      this.task.reminderAt = new Date(this.editableReminderDatetime);
    } else {
      this.task.reminderAt = undefined;
    }

    console.log("Emitting task, isCreateMode:", this.isCreateMode);
    this.taskChanged.emit(this.task);

    this.isSidebarOpen = false;
  }

  removeReminder() {
    if (this.task) {
      this.task.reminderAt = undefined;
      this.editableReminderDatetime = '';
      this.showReminderInput = false;
    }
  }

  removeAssignee(user: User) {
    if (this.task && this.task.assignees) {
      this.task.assignees = this.task.assignees.filter(a => a !== user);
    }
  }

  ngOnInit(): void {
    if (!this.task) {
      this.task = new Task(0, '', 'Nepočato', new Date(), '#3498db', 'Střední', '', undefined, undefined, []);
    }
  }
}
