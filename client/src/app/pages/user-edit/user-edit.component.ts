import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {GroupService} from '@app/services/group.service';

@Component({
  selector: 'app-user-edit',
  imports: [RouterLink],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  standalone: true
})
export class UserEditComponent {
  user = {
    name: 'ahmed mohammad',
    email: 'example.something@gmail.com',
    password: 'hesilko123',
    avatar: 'https://github.com/mdo.png'
  };


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
