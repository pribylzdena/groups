import { Routes } from '@angular/router';
import { TodoComponent } from './pages/todo/todo.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { NotesComponent } from './pages/notes/notes.component';

export const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'notes', component: NotesComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' }
];
