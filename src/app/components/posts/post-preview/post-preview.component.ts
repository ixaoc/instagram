import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IconLikeComponent } from 'app/icons/icon-like/icon-like.component';
import { IconCommentComponent } from 'app/icons/icon-comment/icon-comment.component';

type Item = any;

@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.sass'],
  standalone: true,
  imports: [NgStyle, RouterLink, IconLikeComponent, IconCommentComponent],
})
export class PostPreviewComponent {
  @Input({ required: true }) item!: Item;
  @Input({ required: true }) mediaPath!: string;

  getStyle(media: any) {
    return {
      backgroundImage: `url(${this.mediaPath}${media[0].file})`,
    };
  }
}
