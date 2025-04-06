import {Component, Input} from '@angular/core';
import {Task} from '@models/task';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';


@Component({
  selector: 'app-task',
  imports: [NgForOf, NgIf, NgStyle, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  standalone: true
})
export class TaskComponent {
  @Input() task!: Task;
}
