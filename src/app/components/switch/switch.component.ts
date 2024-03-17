import {
  Component,
  Input,
  Output,
  HostBinding,
  HostListener,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.sass'],
  standalone: true,
})
export class SwitchComponent {
  @Input() on = false;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Output() change = new EventEmitter<boolean>();

  @HostBinding('class.is-on') get isOn() {
    return this.on;
  }

  @HostListener('click') onClick() {
    this.on = !this.on;
    this.change.emit(this.on);
  }

  get isReverse() {
    return this.labelPosition === 'before';
  }
}
