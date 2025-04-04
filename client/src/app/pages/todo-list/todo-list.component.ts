import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { TaskSidebarComponent } from '../../components/task-sidebar/task-sidebar.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TaskSidebarComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  tasks = [
    { color: '#ff7f7f' },
    { color: '#ffaf87' },
    { color: '#c4ff87' },
    { color: '#87c4ff' },
  ];
}
