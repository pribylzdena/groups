import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import { RouterLinkActive } from '@angular/router';
import {NoteService} from '@app/services/note.service';
import {Note} from '@models/note';
import {FormsModule} from '@angular/forms';
import {NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'app-announcement',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
  imports: [
    RouterLink,
    FormsModule,
    NgClass,
    NgStyle
  ],
  standalone: true
})
export class NoteDetailComponent {
  private route: ActivatedRoute
  private groupService: GroupService

  private noteService: NoteService
  public note: Note;

  groupId: number | null = null;
  noteId: number | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(route: ActivatedRoute, groupService: GroupService, noteService: NoteService) {
    this.route = route;
    this.groupService = groupService;
    this.noteService = noteService;
    this.route.paramMap.subscribe(params=> {
      this.noteId = Number(params.get('id'));
    });
  }

  loadNoteFromApi() {
    this.noteService.getNoteFromApi(this.noteId).subscribe({
      next: (response) => {
        console.log(response);
        this.note = response.map(n => new Note(n.id, n.name, n.value, n.color));
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }

  updateNote() {
    console.log('Updating task');
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = Number(params.get('groupId'));
    });

    this.note = this.noteService.getSelectedNote();

    if (!this.note) {
      this.loadNoteFromApi();
    }
  }


}
