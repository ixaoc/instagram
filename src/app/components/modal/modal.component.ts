import {
  Component,
  Input,
  Output,
  HostBinding,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
  standalone: true,
})
export class ModalComponent {
  @Input() appearance = 'default';

  constructor(private router: Router, private route: ActivatedRoute) {}

  onClose() {
    this.router.navigate([{ outlets: { popup: null } }], {
      relativeTo: this.route.parent,
    });
  }
}
