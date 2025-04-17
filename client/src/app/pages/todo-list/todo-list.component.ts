import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common'
import { TaskSidebarComponent } from '@components/task-sidebar/task-sidebar.component';
import { TaskComponent } from '@components/task/task.component';
import { Task } from '@models/task';
import {Priority} from '@enums/priority';
import {TaskStatus} from '@enums/task-status';
import {TaskService} from '@app/services/task.service';
import {TaskDetailSidebarComponent} from '@components/task-detail-sidebar/task-detail-sidebar.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TaskSidebarComponent, TaskComponent, TaskDetailSidebarComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  private taskService: TaskService
  public tasks: Task[];
  public selectedTask: Task | null = null;
  @ViewChild(TaskDetailSidebarComponent, { static: true })
  taskSidebar?: TaskDetailSidebarComponent;
  public isSidebarVisible = false;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
    this.tasks = this.taskService.getAllTasks();
  }

  ngOnInit(): void {
    this.taskService.getTasksFromApi().subscribe({
      next: (response) => {
        console.log(response);
        //this.tasks = response.map(n => new Task(n.id, n.name, n.status, n.deadline, n.color, n.priority, n.description, n.reminderAt, n.parent, n.assignees));
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  openNewTaskSidebar(): void {
    this.selectedTask = undefined;
    this.isSidebarVisible = true;

    if (this.taskSidebar) {
      this.taskSidebar.isCreateMode = true;
      this.taskSidebar.resetForm();
    }
  }
  openTaskSidebar(task: Task): void {
    this.selectedTask = {...task};

    const sidebarComponent = document.querySelector('app-task-detail-sidebar');
    if (sidebarComponent) {
      const componentInstance = (sidebarComponent as any)['__ngContext__'].instance;
      if (componentInstance && typeof componentInstance.toggleSidebar === 'function') {
        componentInstance.isSidebarOpen = true;

        if (task.deadline) {
          componentInstance.editableDatetime = this.formatDateForInput(task.deadline);
        }
        if (task.reminderAt) {
          componentInstance.editableReminderDatetime = this.formatDateForInput(task.reminderAt);
          componentInstance.showReminderInput = true;
        }
      }
    }
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  onTaskCreated(task: Task): void {
    this.tasks.push(task);

    //this.taskService.createTask(task);

    this.selectedTask = null;
  }

  onTaskChanged(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }

   //this.taskService.updateTask(task);

    this.selectedTask = null;
  }


}
