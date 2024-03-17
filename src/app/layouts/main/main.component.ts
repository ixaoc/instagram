import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserService } from 'services';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class MainLayoutComponent implements OnInit {
  user!: any;
  subscribes: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscribes['user'] = this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
