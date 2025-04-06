import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  notes = [
    { id: 1, color: '#ff7f7f' },
    { id: 2, color: '#ffaf87' },
    { id: 3, color: '#c4ff87' },
    { id: 4, color: '#87c4ff' },
    { id: 5, color: '#58d658' },
    { id: 6, color: '#87ffff' },
    { id: 7, color: '#b24d4d' },
    { id: 8, color: '#c4c458' },
    { id: 9, color: '#9087ff' },
    { id: 10, color: '#0047ab' },
    { id: 11, color: '#c487ff' },
    { id: 12, color: '#1f6030' },
    { id: 13, color: '#502450' },
    { id: 14, color: '#846a29' },
    { id: 15, color: '#ffffff' }
  ];

}
