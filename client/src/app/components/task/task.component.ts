import {Component, Input} from '@angular/core';
import {Task} from '@models/task';
import {DatePipe, NgClass, NgIf, NgStyle} from '@angular/common';


@Component({
  selector: 'app-task',
  imports: [NgStyle, DatePipe, NgClass, NgIf],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  standalone: true
})
export class TaskComponent {
  @Input() task!: Task;

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
}
