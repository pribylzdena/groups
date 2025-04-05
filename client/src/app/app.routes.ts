import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NotificationListComponent } from './pages/notification-list/notification-list.component';
import { NoteListComponent } from './pages/note-list/note-list.component';
import {NgModule} from '@angular/core';
import {NotificationDetailComponent} from './pages/notification-detail/notification-detail.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';
import {NoteDetailComponent} from './pages/note-detail/note-detail.component';
import {GroupDetailComponent} from './pages/group-detail/group-detail.component';
import {UserEditComponent} from './pages/user-edit/user-edit.component';


export const routes: Routes = [
  { path: 'todo', component: TodoListComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'notifications', component: NotificationListComponent },
  { path: 'notes', component: NoteListComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'notification-show', component: NotificationDetailComponent},
  { path: 'profile', component: UserDetailComponent },
  { path: 'profile-edit', component: UserEditComponent},
  { path: 'note-detail', component: NoteDetailComponent},
  { path: 'group-manage', component: GroupDetailComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
