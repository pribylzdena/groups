import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GroupService} from '@app/services/group.service';
import { RouterLinkActive } from '@angular/router';

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

  groupId: string | null = null;
  protected readonly RouterLinkActive = RouterLinkActive;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.groupId = params.get('groupId');
    });
  }
}
