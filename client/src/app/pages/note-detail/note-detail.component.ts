import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import { RouterLinkActive } from '@angular/router';
import {NoteService} from '@app/services/note.service';
import {Note} from '@models/note';

@Component({
  selector: 'app-announcement',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
  imports: [
    RouterLink
  ],
  standalone: true
})
export class NoteDetailComponent {
  private route: ActivatedRoute
  private groupService: GroupService

  private noteService: NoteService
  public note: Note;

  groupId: string | null = null;
  noteId: string | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(route: ActivatedRoute, groupService: GroupService, noteService: NoteService) {
    this.route = route;
    this.groupService = groupService;
    this.noteService = noteService;
    this.route.paramMap.subscribe(params=> {
      this.noteId = params.get('id');
    });
    this.note = this.noteService.getNoteById(Number(this.noteId));
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = params.get('groupId');
    });
  }
}
