import {
  Component,
  Input,
  Output,
  HostBinding,
  EventEmitter,
} from '@angular/core'

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.sass'],
})
export class PanelComponent {
  @Input() open = false
  @Output() change = new EventEmitter<boolean>()

  @HostBinding('class.is-open') get isOpen() {
    return this.open
  }

  onClose() {
    this.open = false
    this.change.emit(this.open)
  }
}
