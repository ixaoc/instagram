import { Component, Input, HostBinding } from '@angular/core';

//type Appearance = 'default';
//type Sizes = '25px' | '32px' | '60px' | '100px' | '150px';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass'],
  standalone: true,
})
export class LoaderComponent {
  @HostBinding('class.is-center')
  @Input({
    transform: (val: string) => val.length === 0,
  })
  center: boolean = false;
}
