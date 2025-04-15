import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { TaskSidebarComponent } from '@components/task-sidebar/task-sidebar.component';
import { TaskComponent } from '@components/task/task.component';
import { Task } from '@models/task';
import {Priority} from '@enums/priority';
import {TaskStatus} from '@enums/task-status';
import {TaskService} from '@app/services/task.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TaskSidebarComponent, TaskComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  private taskService: TaskService
  public tasks: Task[];

  constructor(taskService: TaskService) {
    this.taskService = taskService;
    this.tasks = this.taskService.getAllTasks();
  }
}
