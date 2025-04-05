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
    avatar: 'https://cdn-icons-png.flaticon.com/512/5231/5231019.png'
  };
}
