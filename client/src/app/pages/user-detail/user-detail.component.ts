import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
}
