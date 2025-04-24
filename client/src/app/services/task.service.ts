import {Injectable} from '@angular/core';
import {Task} from '@models/task';
import {User} from '@models/user';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthorizationService} from '@app/services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http: HttpClient;
  private authService: AuthorizationService;

  constructor(http: HttpClient, authService: AuthorizationService) {
    this.http = http;
    this.authService = authService;
  }

  private tasks: Task[] = [
    new Task(
      1,
      'Dokončit prezentaci',
      'Dokončeno',
      new Date('2025-04-20T12:00:00'),
      '#ff6b6b',
      'Vysoká',
      'Připravit finální verzi prezentace pro klienta.',
      new Date('2025-04-19T10:00:00'),
      undefined,
      [
        new User(1, 'Anna Nováková', 'anna@example.com', 'https://example.com/avatar1.png'),
        new User(2, 'Jan Svoboda', 'jan@example.com', 'https://example.com/avatar2.png')
      ]
    ),
    new Task(
      2,
      'Revidovat poznámky',
      'Probíhá',
      new Date('2025-04-18T14:00:00'),
      '#feca57',
      'Střední',
      'Projít si poznámky ke schůzce z minulého týdne.',
      new Date('2025-04-18T10:00:00'),
      undefined,
      [
        new User(3, 'Eva Dvořáková', 'eva@example.com', 'https://example.com/avatar3.png')
      ]
    ),
    new Task(
      3,
      'Založit novou skupinu',
      'Nepočato',
      new Date('2025-04-25T09:00:00'),
      '#54a0ff',
      'Nízká',
      'Vytvořit skupinu pro nový projekt a pozvat členy.',
      new Date('2025-04-24T17:00:00'),
      undefined,
      [
        new User(4, 'Tomáš Král', 'tomas@example.com', 'https://example.com/avatar4.png'),
        new User(1, 'Anna Nováková', 'anna@example.com', 'https://example.com/avatar1.png')
      ]
    ),
    new Task(
      4,
      'Odeslat týdenní report',
      'Probíhá',
      new Date('2025-04-17T16:00:00'),
      '#1dd1a1',
      'Vysoká',
      'Sepsat a odeslat týdenní report managementu.',
      new Date('2025-04-17T12:00:00'),
      undefined,
      [
        new User(2, 'Jan Svoboda', 'jan@example.com', 'https://example.com/avatar2.png')
      ]
    ),
    new Task(
      5,
      'Zkontrolovat úkoly ve skupině',
      'Pozastaveno',
      new Date('2025-04-22T15:00:00'),
      '#5f27cd',
      'Střední',
      'Projít, zda členové plní úkoly ve skupině správně.',
      new Date('2025-04-22T10:00:00'),
      undefined,
      [
        new User(5, 'Lucie Benešová', 'lucie@example.com', 'https://example.com/avatar5.png')
      ]
    )
  ];


  getTaskById(id: number) {
    return this.tasks.find(g => g.id === id);
  }

  getAllTasks() {
    return this.tasks;
  }

  getTasksFromApi(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/groups/${groupId}/tasks`);
  }

  //getTaskFromApi(id: number): Observable<any> {
  //  return this.http.get<any>(`${environment.apiUrl}/api/groups/{groupId}/tasks/` + id)
  //}

  createTask(task: Task, groupId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/groups/${groupId}/tasks`, task);
  }

  updateTask(task: Task, groupId: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/groups/${groupId}/tasks/${task.id}`, task);
  }
}
