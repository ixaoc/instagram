import { Component } from '@angular/core';
import { environment } from 'app/../environments/environment';

import _ from 'lodash';
import { Subscription } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';

import { Post, SaveService, LikeService, CommentService } from 'services';

import {
  InfiniteListComponent,
  InfiniteListEmptyComponent,
  InfiniteListEmptyTextComponent,
  PostPreviewComponent,
} from 'components';

@Component({
  selector: 'app-profile-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.sass'],
  standalone: true,
  imports: [
    TranslocoPipe,
    InfiniteListComponent,
    InfiniteListEmptyComponent,
    InfiniteListEmptyTextComponent,
    PostPreviewComponent,
  ],
})
export class SavedComponent {
  ready = false;
  infiniteLoading = false;

  subscriptions: Record<string, Subscription> = {};

  items: Post[] = [];

  // Todo: switch page on last post's id
  currentPage = 1;
  pageCount = 1;
  perPage = 12;

  mediaUrl = environment.mediaPaths.post.original;

  constructor(
    private likeService: LikeService,
    private saveService: SaveService,
    private commentService: CommentService
  ) {}

  //----------------------

  ngOnInit(): void {
    this.loadItems(1);

    this.subscriptions['saveService/history'] =
      this.saveService.history$.subscribe((data) => {
        if (data.name === 'create') {
          this.loadItems(1, true);
        }

        if (data.name === 'delete') {
          const index = _.findIndex(this.items, (item) => item.id === +data.id);

          if (index !== -1) {
            this.items.splice(index, 1);
          }
        }
      });

    this.subscriptions['likeService/history'] =
      this.likeService.history$.subscribe((data) => {
        if (data.name === 'create') {
          this.changeLikeByPost(data.response.post_id, 1);
        }

        if (data.name === 'delete') {
          this.changeLikeByPost(data.id, -1);
        }
      });

    this.subscriptions['commentService/history'] =
      this.commentService.history$.subscribe((data) => {
        if (data.name === 'create') {
          this.items = _.map(this.items, (item) => {
            if (item.id === +data.response.post_id) {
              item.comments = item.comments + 1;
            }

            return item;
          });
        }
      });
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  //----------------------

  loadItems(page: number, reload = false) {
    if (reload) {
      this.ready = false;
      this.currentPage = 1;
    }

    this.saveService
      .all({
        page,
        'per-page': this.perPage,
      })
      .subscribe((data) => {
        this.ready = true;
        this.infiniteLoading = false;
        this.currentPage = data._meta.currentPage;
        this.pageCount = data._meta.pageCount;

        const items = _.map(data.items, (item) => item.post);
        this.items = reload ? items : this.items.concat(items);
      });
  }

  nextPosts() {
    if (this.currentPage + 1 <= this.pageCount) {
      this.infiniteLoading = true;
      this.loadItems(this.currentPage + 1);
    }
  }

  changeLikeByPost(id: number, changeTo: number) {
    this.items = _.map(this.items, (item) => {
      if (item.id === id) {
        item.likes += changeTo;
      }

      return item;
    });
  }
}
