import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
  tasks = [
    { color: '#ff7f7f' },
    { color: '#ffaf87' },
    { color: '#c4ff87' },
    { color: '#87c4ff' },
  ];
}
