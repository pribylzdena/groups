import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { TaskSidebarComponent } from '@components/task-sidebar/task-sidebar.component';
import { TaskComponent } from '@components/task/task.component';
import { Task } from '@models/task';
import {Priority} from '@enums/priority';
import {TaskStatus} from '@enums/task-status';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TaskSidebarComponent, TaskComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  tasks: Task[];

  constructor() {
    this.tasks = [
      new Task(1, 'Ukol 1', 'Popis úkolu 1', Priority.Low, TaskStatus.NotStarted, '#ff7f7f', new Date('2025-04-01'), new Date('2025-04-01')),
      new Task(2, 'Ukol 2', 'Popis úkolu 2', Priority.Medium, TaskStatus.InProgress, '#ffaf87', new Date('2025-04-02'), new Date('2025-04-02')),
      new Task(3, 'Ukol 3', 'Popis úkolu 3', Priority.High, TaskStatus.Completed, '#c4ff87', new Date('2025-04-03'), new Date('2025-04-03')),
      new Task(4, 'Ukol 4', 'Popis úkolu 4', Priority.High, TaskStatus.OnHold, '#87c4ff', new Date('2025-04-04'), new Date('2025-04-04'))
    ];
  }
}
