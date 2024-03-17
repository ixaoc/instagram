import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[click], [routerLink]',
  standalone: true,
})
export class ClickCursorDirective {
  @HostBinding('style.cursor') cursor: string = 'pointer';
}
