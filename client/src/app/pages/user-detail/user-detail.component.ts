import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {GroupService} from '@app/services/group.service';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone: true
})
export class UserDetailComponent {
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
