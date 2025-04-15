import { Injectable } from '@angular/core';
import { Task } from '@models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    new Task(
      1,
      'Dokončit prezentaci',
      'Připravit finální verzi prezentace pro klienta.',
      'Vysoká',
      'Dokončeno',
      '#ff6b6b',
      new Date('2025-04-20T12:00:00'),
      new Date('2025-04-19T10:00:00')
    ),
    new Task(
      2,
      'Revidovat poznámky',
      'Projít si poznámky ke schůzce z minulého týdne.',
      'Střední',
      'Probíhá',
      '#feca57',
      new Date('2025-04-18T14:00:00'),
      new Date('2025-04-18T10:00:00')
    ),
    new Task(
      3,
      'Založit novou skupinu',
      'Vytvořit skupinu pro nový projekt a pozvat členy.',
      'Nízká',
      'Nepočato',
      '#54a0ff',
      new Date('2025-04-25T09:00:00'),
      new Date('2025-04-24T17:00:00')
    ),
    new Task(
      4,
      'Odeslat týdenní report',
      'Sepsat a odeslat týdenní report managementu.',
      'Vysoká',
      'Probíhá',
      '#1dd1a1',
      new Date('2025-04-17T16:00:00'),
      new Date('2025-04-17T12:00:00')
    ),
    new Task(
      5,
      'Zkontrolovat úkoly ve skupině',
      'Projít, zda členové plní úkoly ve skupině správně.',
      'Střední',
      'Pozastaveno',
      '#5f27cd',
      new Date('2025-04-22T15:00:00'),
      new Date('2025-04-22T10:00:00')
    )
  ];

  getTaskById(id: number) {
    return this.tasks.find(g => g.id === id);
  }

  getAllTasks() {
    return this.tasks;
  }
}
