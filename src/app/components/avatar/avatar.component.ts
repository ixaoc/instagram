import { Component, Input, HostBinding } from '@angular/core';

type Appearance = 'default';
type Sizes = '25px' | '32px' | '60px' | '100px' | '150px';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.sass'],
  standalone: true,
})
export class AvatarComponent {
  @Input() appearance: Appearance = 'default';
  @Input() src!: string;

  @HostBinding('style.width')
  @HostBinding('style.height')
  @Input({ transform: (val: string) => `${val}px` })
  size: Sizes = '100px';
}
