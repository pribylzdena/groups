import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NotificationListComponent } from './pages/notification-list/notification-list.component';
import { NoteListComponent } from './pages/note-list/note-list.component';
import {NgModule} from '@angular/core';
import {NotificationDetailComponent} from './pages/notification-detail/notification-detail.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';
import {NoteDetailComponent} from './pages/note-detail/note-detail.component';
import {GroupManageComponent} from './pages/group-manage/group-manage.component';
import {GroupComponent} from './components/group/group.component';
import {NotificationCreateComponent} from '@app/pages/notification-create/notification-create.component';
import { LoginComponent } from '@app/pages/login/login.component';
import {RegisterComponent} from '@app/pages/register/register.component';
import {AuthGuard} from '@app/auth.guard';
import {GroupEditComponent} from '@app/pages/group-edit/group-edit.component';

export const routes: Routes = [
  {
    path: 'groups/:groupId',
    component: GroupComponent,
    canActivate:[AuthGuard],
    children: [
      { path: 'todo', component: TodoListComponent, canActivate:[AuthGuard]},
      { path: 'schedule', component: ScheduleComponent, canActivate:[AuthGuard] },
      { path: 'notes', component: NoteListComponent, canActivate:[AuthGuard] },
      { path: 'note-detail/:id', component: NoteDetailComponent, canActivate:[AuthGuard] },
      { path: 'edit', component: GroupEditComponent, canActivate:[AuthGuard] },
      { path: '', redirectTo: 'todo', pathMatch: 'full' },
    ]
  },
  { path: 'notifications', component: NotificationListComponent, canActivate:[AuthGuard] },
  { path: 'notification-show/:id', component: NotificationDetailComponent, canActivate:[AuthGuard] },
  { path: 'notification-create', component: NotificationCreateComponent, canActivate:[AuthGuard] },
  { path: 'profile', component: UserDetailComponent, canActivate:[AuthGuard] },
  { path: 'group-manage', component: GroupManageComponent, canActivate:[AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
