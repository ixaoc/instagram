import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  QueryList,
  ContentChildren,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.sass'],
})
export class TabGroupComponent implements OnInit, AfterViewInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  @Input() selectedIndex?: number;
  @Output() selectedIndexChange = new EventEmitter<number>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let hasActive = false;

    for (let tab of this.tabs) {
      if (tab.isActive) hasActive = true;
    }

    if (!hasActive) {
      const index = this.selectedIndex ?? 0;
      this.tabs.toArray()[index].isActive = true;
    }

    this.cd.detectChanges();
  }

  activate(index: number): void {
    for (let tab of this.tabs) {
      tab.isActive = false;
    }

    this.tabs.toArray()[index].isActive = true;
    this.selectedIndexChange.emit(index);
  }
}
