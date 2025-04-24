import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import {RouterLinkActive} from '@angular/router';
import {NoteService} from '@app/services/note.service';
import {Note} from '@models/note';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  animations: [
    trigger('notesList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class NoteListComponent {
  private route: ActivatedRoute
  private groupService: GroupService

  private noteService: NoteService
  public notes: Note[];

  public showModal = false;
  public newNoteName = '';
  public newNoteColor = '';
  public showValidationErrorName = false;
  public showValidationErrorColor = false;
  public isSubmitting = false;

  groupId: number | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(route: ActivatedRoute, groupService: GroupService, noteService: NoteService) {
    this.route = route;
    this.groupService = groupService;
    this.noteService = noteService;
    // this.notes = this.noteService.getAllNotes();
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.newNoteName = '';
      this.newNoteColor = '#3498db';
      this.showValidationErrorName = false;
      this.showValidationErrorColor = false;
    }
  }

  selectNote(note: Note) {
    this.noteService.setSelectedNote(note);
  }

  createNote(): void {
    if (!this.newNoteName || this.newNoteName.length < 3) {
      this.showValidationErrorName = true;
      return;
    }

    if (!this.newNoteColor || this.newNoteColor.length !== 7) {
      this.showValidationErrorColor = true;
      return;
    }

    this.showValidationErrorName = false;
    this.showValidationErrorColor = false;
    this.isSubmitting = true;

    this.noteService.createNote(new Note(0, this.newNoteName, '', this.newNoteColor), this.groupId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadNotes();
        this.toggleModal();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Chyba při vytváření skupiny:', error);
      }
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = Number(params.get('groupId'));
    });

    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getNotesFromApi().subscribe({
      next: (response) => {
        console.log(response);
        this.notes = response.map(n => new Note(n.id, n.name, n.value, n.color));
      },
      error: (error) => {
        console.error('Chyba při načítání dat z API:', error);
      }
    });
  }
}
