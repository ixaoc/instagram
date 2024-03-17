import {
  Component,
  Input,
  Output,
  HostBinding,
  ViewChild,
  ContentChild,
  ElementRef,
  EventEmitter,
} from '@angular/core';

import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IconLikeComponent } from 'app/icons/icon-like/icon-like.component';
import { IconCommentComponent } from 'app/icons/icon-comment/icon-comment.component';

import { LoaderComponent, InfiniteListEmptyComponent } from 'components';

@Component({
  selector: 'infinite-list',
  templateUrl: './infinite-list.component.html',
  styleUrls: ['./infinite-list.component.sass'],
  standalone: true,
  imports: [
    NgStyle,
    NgTemplateOutlet,
    RouterLink,
    LoaderComponent,
    IconLikeComponent,
    IconCommentComponent,
  ],
})
export class InfiniteListComponent {
  @Input({ required: true }) ready!: boolean;
  @Input({ required: true }) end!: boolean;

  intersectionObserver!: IntersectionObserver;
  @Output() intersectionObserverDetect = new EventEmitter<void>();

  @HostBinding('class.is-init') get init() {
    return !this.ready;
  }

  @ContentChild(InfiniteListEmptyComponent)
  empty!: InfiniteListEmptyComponent;

  @ViewChild('infiniteLoader') infiniteLoader!: ElementRef;

  //----------------------

  ngOnInit() {
    const threshold = 0;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.intersectionObserverDetect.emit();
          }
        });
      },
      { threshold }
    );
  }

  ngAfterViewChecked() {
    if (this.intersectionObserver && this.infiniteLoader?.nativeElement) {
      this.intersectionObserver.observe(this.infiniteLoader.nativeElement);
    }
  }

  ngOnDestroy() {
    this.intersectionObserver.disconnect();
  }
}
