import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input',
})
export class InputDirective {
  element;
  name;
  type;
  focus = false;

  constructor(private el: ElementRef) {
    this.element = el;
    this.name = el.nativeElement.name;
    this.type = el.nativeElement.type;
  }

  @HostListener('focus')
  onFocus() {
    this.focus = true;
  }

  @HostListener('blur')
  onBlur() {
    this.focus = false;
  }
}
