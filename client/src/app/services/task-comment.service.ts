import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthorizationService} from '@app/services/authorization.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {TaskComment} from '@models/task-comment';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService {
  private http: HttpClient;
  private authService: AuthorizationService;

  constructor(http: HttpClient, authService: AuthorizationService) {
    this.http = http;
    this.authService = authService;
  }

  createTaskComment(taskComment: TaskComment, groupId: number, taskId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/groups/${groupId}/tasks/${taskId}/comments`, taskComment);
  }

  deleteTaskComment(taskComment: TaskComment, groupId: number, taskId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/groups/${groupId}/tasks/${taskId}/comments/${taskComment.id}`);
  }
}
