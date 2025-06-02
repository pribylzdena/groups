import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, HostListener} from '@angular/core';
import { Task } from '@models/task';
import { User } from '@models/user';
import { DatePipe, NgClass, NgIf, NgStyle, NgFor } from '@angular/common';
import {FormArray, FormControl, FormsModule} from '@angular/forms';
import {TaskComment} from '@models/task-comment';
import {UserService} from '@app/services/user.service';

@Component({
  selector: 'app-task-detail-sidebar',
  imports: [NgStyle, DatePipe, NgClass, NgIf, NgFor, FormsModule],
  templateUrl: './task-detail-sidebar.component.html',
  styleUrl: './task-detail-sidebar.component.scss',
  standalone: true
})
export class TaskDetailSidebarComponent implements OnInit{
  @Input() task: Task | null = null;
  @Input() users: User[];
  @Output() taskChanged = new EventEmitter<Task>();

  private userService: UserService;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const assigneesSection = target.closest('.assignees-section');

    if (!assigneesSection) {
      this.showUserDropdown = false;
    }
  }

  userSearchQuery: '';

  isSidebarOpen: boolean = false;
  editableDatetime: string = '';
  editableReminderDatetime: string = '';
  showReminderInput = false;
  filteredUsers: User[];
  showUserDropdown: boolean;
  isCreateMode = false;

  newCommentText: string = '';
  replyingToComment: TaskComment | null = null;
  currentUser: User | null = null;
  newlyAddedCommentIds: Set<number> = new Set();

  availableColors: string[] = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#16a085', '#d35400'
  ];

  constructor(userService: UserService) {
    this.userService = userService;

    this.loadUser();

    this.filteredUsers = [];
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  saveTask() {
    if (!this.task) {
      console.error('No task available to save');
      return;
    }

    if (this.editableDatetime) {
      this.task.deadline = new Date(this.editableDatetime);
    }

    if (this.showReminderInput && this.editableReminderDatetime) {
      this.task.reminderAt = new Date(this.editableReminderDatetime);
    } else {
      this.task.reminderAt = undefined;
    }

    console.log("Emitting task, isCreateMode:", this.isCreateMode);
    this.taskChanged.emit(this.task);

    this.isSidebarOpen = false;
  }

  removeReminder() {
    if (this.task) {
      this.task.reminderAt = undefined;
      this.editableReminderDatetime = '';
      this.showReminderInput = false;
    }
  }

  removeAssignee(user: User) {
    if (this.task && this.task.assignees) {
      this.task.assignees = this.task.assignees.filter(a => a !== user);
    }
  }

  addAssignee(user: User): void {
    if (!this.isAssignee(user.id)) {
      this.task.assignees.push(user);
      this.userSearchQuery = '';
      this.filteredUsers = [];
      this.showUserDropdown = false;
    }
  }

  ngOnInit(): void {
    if (!this.task) {
      this.task = new Task(0, '', 'Nepočato', new Date(), '#3498db', 'Střední', '', new Date(), undefined, []);
    }

    if (!this.task.comments) {
      this.task.comments = [];
    }

    this.loadUser();

    this.filteredUsers = [];
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
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    ).filter(user =>
      !this.isAssignee(user.id)
    );
  }

  private isAssignee(userId: number) {
    return this.task.assignees?.some(r => r.id === userId) || false;
  }

  getCommentsCount(): number {
    return this.task?.comments?.length || 0;
  }

  getSortedComments(): TaskComment[] {
    if (!this.task?.comments) return [];

    // Vrátí pouze hlavní komentáře (bez odpovědí)
    return this.task.comments
      .filter(comment => !comment.respondTo)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getRepliesForComment(commentId: number): TaskComment[] {
    if (!this.task?.comments) return [];

    return this.task.comments
      .filter(comment => comment.respondTo?.id === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
    if (!this.newCommentText?.trim() || !this.currentUser) {
      return;
    }

    const newComment = new TaskComment(
      this.generateCommentId(),
      this.newCommentText.trim(),
      this.replyingToComment || undefined,
      this.currentUser
    );

    (newComment as any).createdAt = new Date();

    if (!this.task.comments) {
      this.task.comments = [];
    }

    this.task.comments.push(newComment);

    this.newlyAddedCommentIds.add(newComment.id);
    setTimeout(() => {
      this.newlyAddedCommentIds.delete(newComment.id);
    }, 1000);

    this.newCommentText = '';
    this.replyingToComment = null;

    console.log('Nový komentář přidán:', newComment);
  }

  deleteComment(comment: TaskComment): void {
    if (!this.task?.comments || !this.canDeleteComment(comment)) {
      return;
    }

    const index = this.task.comments.findIndex(c => c.id === comment.id);
    if (index > -1) {
      this.task.comments = this.task.comments.filter(c =>
        c.id !== comment.id && c.respondTo?.id !== comment.id
      );

      console.log('Komentář smazán:', comment);
    }
  }

  canDeleteComment(comment: TaskComment): boolean {
    return comment.user.id === this.currentUser?.id;
  }

  isNewComment(commentId: number): boolean {
    return this.newlyAddedCommentIds.has(commentId);
  }

  private generateCommentId(): number {
    return Math.max(0, ...(this.task?.comments?.map(c => c.id) || [])) + 1;
  }

  loadUser() {
    this.userService.getUserFromApi().subscribe({
      next: (response) => {
        this.currentUser = response;
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }
}
