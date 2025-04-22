import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '@models/task';
import { User } from '@models/user';
import { DatePipe, NgClass, NgIf, NgStyle, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  imports: [NgStyle, DatePipe, NgClass, NgIf, NgFor, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  standalone: true
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() taskChanged = new EventEmitter<Task>();

  isSidebarOpen = false;
  editableDatetime: string = '';
  editableReminderDatetime: string = '';
  showReminderInput = false;
  showAssigneeSelector = false;

  availableColors: string[] = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#16a085', '#d35400'
  ];

  getStatusClass() {
    if (this.task.status === 'Probíhá') return 'in-progress';
    if (this.task.status === 'Nepočato') return 'not-started';
    if (this.task.status === 'Dokončeno') return 'completed';
    if (this.task.status === 'Pozastaveno') return 'stopped';
    return '';
  }

  getPriorityClass() {
    if (this.task.priority === 'Vysoká') return 'high';
    if (this.task.priority === 'Střední') return 'medium';
    if (this.task.priority === 'Nízká') return 'low';
    return '';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  saveTask() {
    if (this.editableDatetime) {
      this.task.deadline = new Date(this.editableDatetime);
    }

    //if (this.showReminderInput && this.editableReminderDatetime) {
    //  this.task.reminderAt = new Date(this.editableReminderDatetime);
    //} else if (!this.showReminderInput) {
    //  this.task.reminderAt = undefined;
    //}

    this.taskChanged.emit(this.task);

    this.task = { ...this.task };

    this.toggleSidebar();
  }

  removeReminder() {
    this.task.reminderAt = undefined;
    this.editableReminderDatetime = '';
    this.showReminderInput = false;
  }

  removeAssignee(user: User) {
    if (this.task.assignees) {
      this.task.assignees = this.task.assignees.filter(a => a !== user);
    }
  }
}
