import { Directive, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName]',
  standalone: true,
})
export class ControlDirective implements OnInit {
  constructor(private el: ElementRef, private control: NgControl) {}

  ngOnInit() {
    (this.control.control as any).nativeElement = this.el.nativeElement;
  }
}
