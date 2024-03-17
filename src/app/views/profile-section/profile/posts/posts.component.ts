import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from 'app/../environments/environment';

import _ from 'lodash';
import { Subscription } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';

import {
  PostService,
  LikeService,
  CommentService,
  ProfileService,
} from 'services';

import {
  InfiniteListComponent,
  InfiniteListEmptyComponent,
  InfiniteListEmptyTextComponent,
  PostPreviewComponent,
} from 'components';

type Post = any;

@Component({
  selector: 'app-profile-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe,
    InfiniteListComponent,
    InfiniteListEmptyComponent,
    InfiniteListEmptyTextComponent,
    PostPreviewComponent,
  ],
})
export class PostsComponent {
  ready = false;
  infiniteLoading = false;

  subscriptions: Record<string, Subscription> = {};

  user!: any;
  items: Post[] = [];

  // Todo: switch page on last post's id
  currentPage = 1;
  pageCount = 1;
  perPage = 12;

  mediaUrl = environment.mediaPaths.post.original;

  constructor(
    private postService: PostService,
    private likeService: LikeService,
    private commentService: CommentService,
    private profileService: ProfileService
  ) {}

  //----------------------

  ngOnInit(): void {
    this.subscriptions['profileService/history'] =
      this.profileService.user$.subscribe((user) => {
        this.user = user;
        this.loadItems(1);
      });

    this.subscriptions['postService/history'] =
      this.postService.history$.subscribe((data) => {
        if (data.name === 'create') {
          this.loadItems(1, true);
        }

        if (data.name === 'delete') {
          this.items = _.filter(this.items, (item) => item.id !== +data.id);
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

    this.postService
      .all({
        id: this.user.id,
        page,
        'per-page': this.perPage,
      })
      .subscribe((data) => {
        this.ready = true;
        this.infiniteLoading = false;
        this.currentPage = data._meta.currentPage;
        this.pageCount = data._meta.pageCount;

        this.items = reload ? data.items : this.items.concat(data.items);
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
