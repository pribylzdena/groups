import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './pages/todo/todo.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { NotesComponent } from './pages/notes/notes.component';
import {NgModule} from '@angular/core';
import {NotificationDetailComponent} from './pages/notification-detail/notification-detail.component';


export const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'notes', component: NotesComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'notification-show', component: NotificationDetailComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
