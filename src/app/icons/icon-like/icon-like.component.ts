import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'icon-like',
  templateUrl: './icon-like.component.html',
  styleUrls: ['./icon-like.component.sass'],
  standalone: true,
})
export class IconLikeComponent {
  @HostBinding('class.is-active')
  @Input()
  active!: boolean;
}
