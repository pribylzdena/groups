import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  user = {
    name: 'ahmed mohammad',
    email: 'example.something@gmail.com',
    password: 'hesilko123',
    avatar: 'https://github.com/mdo.png'
  };
}
