import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'button[appearance]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
  standalone: true,
})
export class ButtonComponent {
  @Input({ transform: (val: string) => (!val.length ? 'default' : val) })
  appearance!: string;

  @Input() loading: boolean = false;
  @Input() loadingText: string = 'loading...';

  @HostBinding('class.default')
  get defaultStyle() {
    return this.appearance === 'default';
  }

  // ngOnInit() {
  //   console.log(this.styled);
  // }
}
