import { Component, ViewEncapsulation, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class AuthLayoutComponent {
  @HostBinding('class.layout')
  host = true;
}
