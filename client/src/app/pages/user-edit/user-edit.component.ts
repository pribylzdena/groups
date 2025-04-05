import { Component } from '@angular/core';

@Component({
  selector: 'app-user-edit',
  imports: [],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
  user = {
    name: 'ahmed mohammad',
    email: 'example.something@gmail.com',
    password: 'hesilko123',
    avatar: 'https://github.com/mdo.png'
  };
}
