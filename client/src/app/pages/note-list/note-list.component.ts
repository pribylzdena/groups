import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import {RouterLinkActive} from '@angular/router';
import {NoteService} from '@app/services/note.service';
import {Note} from '@models/note';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  private route: ActivatedRoute
  private groupService: GroupService

  private noteService: NoteService
  public notes: Note[];

  groupId: string | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(route: ActivatedRoute, groupService: GroupService, noteService: NoteService) {
    this.route = route;
    this.groupService = groupService;
    this.noteService = noteService;
    this.notes = this.noteService.getAllNotes();
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = params.get('groupId');
    });
  }
}
