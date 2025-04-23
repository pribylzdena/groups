import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common'
import { TaskComponent } from '@components/task/task.component';
import { Task } from '@models/task';
import {TaskService} from '@app/services/task.service';
import {TaskDetailSidebarComponent} from '@components/task-detail-sidebar/task-detail-sidebar.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TaskComponent, TaskDetailSidebarComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  private taskService: TaskService
  public tasks: Task[];
  public selectedTask: Task | null = null;
  @ViewChild(TaskDetailSidebarComponent, { static: true })
  taskSidebar?: TaskDetailSidebarComponent;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
    this.tasks = this.taskService.getAllTasks();
  }

  ngOnInit(): void {
    this.taskService.getTasksFromApi().subscribe({
      next: (response) => {
        console.log(response);
        this.tasks = response.map(n => new Task(n.id, n.name, n.status, n.deadline, n.color, n.priority, n.description, n.reminderAt, n.parent, n.assignees));
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  openNewTaskSidebar(): void {
    const newTask = new Task(
      0,
      '',
      'Nepočato',
      new Date(),
      '#3498db',
      'Střední',
      '',
      new Date(),
      undefined,
      []
    );

    if (this.taskSidebar) {
      this.taskSidebar.isCreateMode = true;
      this.taskSidebar.isSidebarOpen = true;
      this.taskSidebar.task = newTask;

      if (newTask.deadline) {
        this.taskSidebar.editableDatetime = this.formatDateForInput(newTask.deadline);
      }

      if (newTask.reminderAt) {
        this.taskSidebar.editableDatetime = this.formatDateForInput(newTask.reminderAt);
      }
    }

    this.selectedTask = newTask;
  }

  openTaskSidebar(task: Task): void {
    this.selectedTask = {...task};

    if (this.taskSidebar) {
      this.taskSidebar.isCreateMode = false;
      this.taskSidebar.isSidebarOpen = true;
      this.taskSidebar.task = {...task};

      if (task.deadline) {
        this.taskSidebar.editableDatetime = this.formatDateForInput(task.deadline);
      }
      if (task.reminderAt) {
        this.taskSidebar.editableReminderDatetime = this.formatDateForInput(task.reminderAt);
        this.taskSidebar.showReminderInput = true;
      } else {
        this.taskSidebar.editableReminderDatetime = '';
        this.taskSidebar.showReminderInput = false;
      }
    }
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  saveTask(task: Task): void {
    console.log("Save task called, isCreateMode:", this.taskSidebar?.isCreateMode);

    if (this.taskSidebar?.isCreateMode) {
      this.onTaskCreated(task);
    } else {
      this.onTaskChanged(task);
    }
  }

  private onTaskCreated(task: Task): void {
    task.id = 0;
    this.tasks.push(task);

    console.log("Vytvoreni tasku:", task);

    //this.taskService.createTask(); TODO createTask api

    this.selectedTask = null;
  }

  private onTaskChanged(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }

    console.log("Uprava tasku:", task);
    //this.taskService.updateTask(task); TODO updateTask api
    this.selectedTask = null;
  }
}
