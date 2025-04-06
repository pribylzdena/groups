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
import {UserEditComponent} from './pages/user-edit/user-edit.component';
import {GroupComponent} from './components/group/group.component';
import {NotificationCreateComponent} from '@app/pages/notification-create/notification-create.component';

export const routes: Routes = [
  {
    path: 'groups/:groupId',
    component: GroupComponent,
    children: [
      { path: 'todo', component: TodoListComponent},
      { path: 'schedule', component: ScheduleComponent },
      { path: 'notifications', component: NotificationListComponent },
      { path: 'notification-show/:id', component: NotificationDetailComponent },
      { path: 'notification-create', component: NotificationCreateComponent },
      { path: 'notes', component: NoteListComponent },
      { path: 'note-detail/:id', component: NoteDetailComponent },
      { path: '', redirectTo: 'todo', pathMatch: 'full' }
    ]
  },
  { path: 'group-manage', component: GroupManageComponent },
  { path: 'profile', component: UserDetailComponent },
  { path: 'profile-edit', component: UserEditComponent },
  { path: '', redirectTo: '/group-manage', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
