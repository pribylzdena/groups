import { Injectable } from '@angular/core';
import {Note} from '@models/note';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  private notes: Note[] = [
    new Note(1, 'Filmy', 'Hodne dlouha poznamka kamo jakoze vazne hooooooooooooooooooooooooooodneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '#ff6b6b'),
    new Note(2, 'Obecne poznamky', 'Proste obecne', '#ffffff'),
    new Note(3, 'Marketing', 'Jak to udelat?', '#00ff22'),
    new Note(4, 'Poznamka1', 'Poznamka', '#ffff00'),
    new Note(5, 'Nejaka poznamka', '', '#ff0000'),
    new Note(6, 'Diskuze o prezentaci', '', '#ff00fd'),
    new Note(7, 'Neco', '', '#ffe16b'),
    new Note(8, 'Ahoj', 'Prazdno', '#ff6a00'),
    new Note(9, 'Uplne k nicemu poznamka', '', '#df6bff'),
    new Note(10, 'cus', 'cau??', '#ff6b6b'),
    new Note(11, 'Filmy', 'Treba social network?', '#ff6bdc'),
    new Note(12, 'Filmy', '', '#6bb0ff'),
    new Note(13, 'Filmy', '', '#6b6dff'),
    new Note(14, 'Filmy', '', '#6bffab'),
    new Note(15, 'Filmy', '', '#6bd8ff'),
    new Note(16, 'Filmy', '', '#ffe16b'),
    new Note(17, 'Filmy', '', '#6b84ff'),
    new Note(18, 'Filmy', '', '#6b89ff'),
    new Note(19, 'Filmy', '', 'rgba(255,107,142,0.43)'),
  ];

  getNoteById(id: number) : Note {
    let note = this.notes.find(g => g.id === id);
    if (!note) {
      throw new Error(`Note with ID ${id} not found.`);
    }

    return note;
  }

  getAllNotes() {
    return this.notes;
  }

  getNotesFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/notes`);
  }


  getNoteFromApi(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/notes/{id}`);
  }
}
