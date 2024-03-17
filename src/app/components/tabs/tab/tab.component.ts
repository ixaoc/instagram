import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.sass'],
})
export class TabComponent implements OnInit {
  @ViewChild(TemplateRef) template!: TemplateRef<any>;

  @Input() isActive?: boolean;
  @Input() label?: string;

  constructor() {}

  ngOnInit(): void {}
}
