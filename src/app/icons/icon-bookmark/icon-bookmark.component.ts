import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'icon-bookmark',
  templateUrl: './icon-bookmark.component.html',
  styleUrls: ['./icon-bookmark.component.sass'],
  standalone: true,
})
export class IconBookmarkComponent {
  @HostBinding('class.is-active')
  @Input()
  active!: boolean;
}
