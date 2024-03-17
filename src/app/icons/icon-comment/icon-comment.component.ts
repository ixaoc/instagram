import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'icon-comment',
  templateUrl: './icon-comment.component.html',
  styleUrls: ['./icon-comment.component.sass'],
  standalone: true,
})
export class IconCommentComponent {
  @HostBinding('class.is-active')
  @Input()
  active!: boolean;
}
