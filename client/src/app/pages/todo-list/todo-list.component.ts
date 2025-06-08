import {Component, OnInit, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common'
import { Task } from '@models/task';
import {TaskService} from '@app/services/task.service';
import {ActivatedRoute} from '@angular/router';
import {User} from '@models/user';
import {UserService} from '@app/services/user.service';
import {FormsModule} from '@angular/forms';
import {TaskComment} from '@models/task-comment';
import {TaskCommentService} from '@app/services/task-comment.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  private route: ActivatedRoute;
  private taskService: TaskService;
  private userService: UserService;
  private commentService: TaskCommentService;

  public tasks: Task[] = [];
  public selectedTask: Task | null = null;
  public users: User[] = [];
  public currentUser: User | null = null;
  groupId: number | null = null;

  isSidebarOpen: boolean = false;
  public isCreateMode = false;

  editableDatetime: string = '';
  editableReminderDatetime: string = '';
  showReminderInput = false;

  userSearchQuery: string = '';
  filteredUsers: User[] = [];
  showUserDropdown: boolean = false;

  newCommentText: string = '';
  replyingToComment: TaskComment | null = null;
  newlyAddedCommentIds: Set<number> = new Set();

  expandedTasks: Set<number> = new Set();

  availableColors: string[] = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#16a085', '#d35400'
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const assigneesSection = target.closest('.assignees-section');

    if (!assigneesSection) {
      this.showUserDropdown = false;
    }
  }

  constructor(commentService: TaskCommentService, taskService: TaskService, route: ActivatedRoute, userService: UserService) {
    this.taskService = taskService;
    this.userService = userService;
    this.commentService = commentService;

    console.log(this.userService);
    console.log(this.commentService);

    this.route = route;
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = Number(params.get('groupId'));
    });

    this.loadTasks();
    this.loadUsers();
    this.loadCurrentUser();
  }

  loadTasks() {
    this.taskService.getTasksFromApi(this.groupId).subscribe({
      next: (response) => {
        this.tasks = response.map(n => new Task(
          n.id, n.name, n.status, n.deadline, n.color, n.priority,
          n.description, n.reminderAt, n.parent, n.assignees, n.comments
        ))
       },
      error: (error) => {
        console.error('Chyba při načítání úkolů z API:', error);
      }
    });
  }

  loadUsers() {
    this.userService.getUsersFromApi().subscribe({
      next: (response) => {
        this.users = response.map(n => new User(n.id, n.name, n.email, n.logoUrl, n.password));
      },
      error: (error) => {
        console.error('Chyba při načítání uživatelů z API:', error);
      }
    });
  }

  loadCurrentUser() {
    this.userService.getUserFromApi().subscribe({
      next: (response) => {
        this.currentUser = response;
      },
      error: (error) => {
        console.error('Chyba při načítání aktuálního uživatele z API:', error);
      }
    });
  }

  openNewTaskSidebar(): void {
    const newTask = new Task(
      0, '', 'Nepočato', new Date(), '#3498db', 'Střední',
      '', undefined, undefined, [], []
    );
    this.selectedTask = newTask;
    this.isCreateMode = true;
    this.setupSidebarForTask(newTask);
    this.isSidebarOpen = true;
  }

  openTaskSidebar(task: Task): void {
    this.selectedTask = {...task};
    this.isCreateMode = false;
    this.setupSidebarForTask(this.selectedTask);
    this.isSidebarOpen = true;
  }

  setupSidebarForTask(task: Task): void {
    if (task.deadline) {
      const deadline = new Date(task.deadline);
      this.editableDatetime = deadline.toISOString().slice(0, 16);
    } else {
      this.editableDatetime = '';
    }

    if (task.reminderAt) {
      const reminder = new Date(task.reminderAt);
      this.editableReminderDatetime = reminder.toISOString().slice(0, 16);
      this.showReminderInput = true;
    } else {
      this.editableReminderDatetime = '';
      this.showReminderInput = false;
    }

    if (!task.comments) {
      task.comments = [];
    }
    if (!task.assignees) {
      task.assignees = [];
    }

    this.newCommentText = '';
    this.replyingToComment = null;
    this.userSearchQuery = '';
    this.filteredUsers = [];
    this.showUserDropdown = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (!this.isSidebarOpen) {
      this.selectedTask = null;
      this.replyingToComment = null;
      this.newCommentText = '';
      this.isCreateMode = false;
    }
  }

  saveTask() {
    if (!this.selectedTask) {
      console.error('No task available to save');
      return;
    }

    if (this.editableDatetime) {
      this.selectedTask.deadline = new Date(this.editableDatetime);
    } else {
      this.selectedTask.deadline = undefined;
    }

    if (this.showReminderInput && this.editableReminderDatetime) {
      this.selectedTask.reminderAt = new Date(this.editableReminderDatetime);
    } else {
      this.selectedTask.reminderAt = undefined;
    }

    if (this.isCreateMode) {
      this.createTask(this.selectedTask);
    } else {
      this.updateTask(this.selectedTask);
    }
  }

  private createTask(task: Task): void {
    this.tasks.push(task);

    console.log(task);

    this.taskService.createTask(task, this.groupId).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(t => t === task);
        if (index !== -1 && response.id) {
          this.tasks[index].id = response.id;
        }
      },
      error: (error) => {
        console.error('Chyba při vytváření úkolu:', error);
        const index = this.tasks.findIndex(t => t === task);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      }
    });

    this.closeSidebar();
  }

  private updateTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = {...task};
    }

    this.taskService.updateTask(task, this.groupId).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Chyba při aktualizaci úkolu:', error);
        this.loadTasks();
      }
    });

    this.closeSidebar();
  }

  private closeSidebar(): void {
    this.selectedTask = null;
    this.isSidebarOpen = false;
    this.isCreateMode = false;
  }

  removeReminder() {
    if (this.selectedTask) {
      this.selectedTask.reminderAt = undefined;
      this.editableReminderDatetime = '';
      this.showReminderInput = false;
    }
  }

  onUserSearch() {
    this.filterUsers();
    this.showUserDropdown = true;
  }

  filterUsers(): void {
    if (!this.userSearchQuery.trim()) {
      this.filteredUsers = [];
      return;
    }

    const query = this.userSearchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) &&
      !this.isAssignee(user.id)
    );
  }

  addAssignee(user: User): void {
    if (this.selectedTask && !this.isAssignee(user.id)) {
      this.selectedTask.assignees.push(user);
      this.userSearchQuery = '';
      this.filteredUsers = [];
      this.showUserDropdown = false;
    }
  }

  removeAssignee(user: User) {
    if (this.selectedTask && this.selectedTask.assignees) {
      this.selectedTask.assignees = this.selectedTask.assignees.filter(a => a.id !== user.id);
    }
  }

  private isAssignee(userId: number): boolean {
    return this.selectedTask?.assignees?.some(r => r.id === userId) || false;
  }

  getCommentsCount(): number {
    return this.selectedTask?.comments?.length || 0;
  }

  getSortedComments(): TaskComment[] {
    if (!this.selectedTask?.comments) return [];

    return this.selectedTask.comments
      .filter(comment => !comment.respondTo)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getRepliesForComment(commentId: number): TaskComment[] {
    if (!this.selectedTask?.comments) return [];

    return this.selectedTask.comments
      .filter(comment => comment.respondTo?.id === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  startReply(comment: TaskComment): void {
    this.replyingToComment = comment;
    this.newCommentText = '';

    setTimeout(() => {
      const textarea = document.querySelector('.comment-input') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  }

  cancelReply(): void {
    this.replyingToComment = null;
    this.newCommentText = '';
  }

  submitComment(): void {
    if (!this.newCommentText?.trim() || !this.currentUser || !this.selectedTask) {
      return;
    }

    const newComment = new TaskComment(
      this.generateCommentId(),
      this.newCommentText.trim(),
      this.replyingToComment || undefined,
      this.currentUser
    );

    (newComment as any).createdAt = new Date();

    if (!this.selectedTask.comments) {
      this.selectedTask.comments = [];
    }

    this.selectedTask.comments.push(newComment);

    this.commentService.createTaskComment(newComment, this.groupId, this.selectedTask.id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Chyba při vytváření komentare:', error);
      }
    });

    this.newlyAddedCommentIds.add(newComment.id);
    setTimeout(() => {
      this.newlyAddedCommentIds.delete(newComment.id);
    }, 1000);

    this.newCommentText = '';
    this.replyingToComment = null;
  }

  deleteComment(comment: TaskComment): void {
    if (!this.selectedTask?.comments || !this.canDeleteComment(comment)) {
      return;
    }

    const commentsToDelete = this.selectedTask.comments.filter(c =>
      c.id === comment.id || c.respondTo?.id === comment.id
    );

    commentsToDelete.forEach(commentToDelete => {
      this.commentService.deleteTaskComment(commentToDelete, this.groupId, this.selectedTask.id).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Chyba při mazani komentare:', error);
        }
      });
    });

    this.selectedTask.comments = this.selectedTask.comments.filter(c =>
      c.id !== comment.id && c.respondTo?.id !== comment.id
    );
  }

  canDeleteComment(comment: TaskComment): boolean {
    return comment.user.id === this.currentUser?.id;
  }

  isNewComment(commentId: number): boolean {
    return this.newlyAddedCommentIds.has(commentId);
  }

  private generateCommentId(): number {
    return Math.max(0, ...(this.selectedTask?.comments?.map(c => c.id) || [])) + 1;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatCommentTime(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'právě teď';
    if (diffInMinutes < 60) return `před ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `před ${diffInHours} h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `před ${diffInDays} dny`;

    return commentDate.toLocaleDateString('cs-CZ');
  }

  getStatusClass(task: Task): string {
    switch (task.status) {
      case 'Probíhá': return 'in-progress';
      case 'Nepočato': return 'not-started';
      case 'Dokončeno': return 'completed';
      case 'Pozastaveno': return 'stopped';
      default: return '';
    }
  }

  getPriorityClass(task: Task): string {
    switch (task.priority) {
      case 'Vysoká': return 'high';
      case 'Střední': return 'medium';
      case 'Nízká': return 'low';
      default: return '';
    }
  }

  hasChildren(task: Task): boolean {
    return this.tasks.some(t => t.parent?.id === task.id);
  }

  isTaskExpanded(task: Task): boolean {
    return this.expandedTasks.has(task.id);
  }

  toggleTaskExpansion(task: Task, event: Event): void {
    event.stopPropagation();

    if (this.expandedTasks.has(task.id)) {
      this.expandedTasks.delete(task.id);
    } else {
      this.expandedTasks.add(task.id);
    }
  }

  isTaskHidden(task: Task): boolean {
    if (!task.parent) {
      return false;
    }

    return !this.isTaskExpanded(task.parent);
  }

  getSortedTasks(): Task[] {
    const rootTasks = this.tasks.filter(task => !task.parent);
    const sortedTasks: Task[] = [];

    const addTaskWithChildren = (task: Task, level: number = 0) => {
      sortedTasks.push(task);

      if (this.isTaskExpanded(task)) {
        const children = this.tasks
          .filter(t => t.parent?.id === task.id)
          .sort((a, b) => a.name.localeCompare(b.name));

        children.forEach(child => {
          addTaskWithChildren(child, level + 1);
        });
      }
    };

    rootTasks
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(task => addTaskWithChildren(task));

    return sortedTasks;
  }

  getAllChildTasks(parentTask: Task): Task[] {
    const children: Task[] = [];
    const directChildren = this.tasks.filter(t => t.parent?.id === parentTask.id);

    directChildren.forEach(child => {
      children.push(child);
      children.push(...this.getAllChildTasks(child));
    });

    return children;
  }
}
