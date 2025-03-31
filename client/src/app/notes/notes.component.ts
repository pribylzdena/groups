import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class NotesComponent {
  hardcodedNotes = [
    { color: '#ff7f7f' },
    { color: '#ffaf87' },
    { color: '#c4ff87' },
    { color: '#87c4ff' },
    { color: '#58d658' },
    { color: '#87ffff' },
    { color: '#b24d4d' },
    { color: '#c4c458' },
    { color: '#9087ff' },
    { color: '#0047ab' },
    { color: '#c487ff' },
    { color: '#1f6030' },
    { color: '#502450' },
    { color: '#846a29' },
    { color: '#ffffff' }
  ];
}
