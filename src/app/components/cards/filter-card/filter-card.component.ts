import { Component, Input } from '@angular/core';

@Component({
  selector: 'filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.sass']
})
export class FilterCardComponent {

  @Input() open = false
  @Input() label: string | undefined = undefined
  
}
