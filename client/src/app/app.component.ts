import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  showNavbar = true;

  //constructor(private router: Router) {
  //  this.router.events.subscribe(() => {
  //    this.showNavbar = this.router.url.startsWith('/groups/');
  //  });
  //}
}
