import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
}
