import { Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
})
export class CardComponent {
  @HostBinding('class.is-high-shadow') get isHighShadow() {
    return this.shadow === 700
  }
  @Input() shadow = 400
}
