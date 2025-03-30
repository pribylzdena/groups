import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotesComponent } from './notes/notes.component';

export const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'notes', component: NotesComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' }
];
