import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from 'app/../environments/environment';

import _ from 'lodash';
import { Subscription } from 'rxjs';
import { formatDistance, fromUnixTime } from 'date-fns';
//import ruLocale from 'date-fns/locale/ru';
import { TranslocoPipe } from '@ngneat/transloco';

import {
  User,
  Post,
  UserService,
  PostService,
  LikeService,
  SaveService,
  CommentService,
  FollowerService,
} from 'services';

import { ClickCursorDirective } from 'directives';

import { IconLikeComponent } from 'app/icons/icon-like/icon-like.component';
import { IconCommentComponent } from 'app/icons/icon-comment/icon-comment.component';
import { IconBookmarkComponent } from 'app/icons/icon-bookmark/icon-bookmark.component';

import {
  LoaderComponent,
  AvatarComponent,
  InfiniteListComponent,
  InfiniteListEmptyComponent,
  InfiniteListEmptyTextComponent,
} from 'components';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe,
    IconLikeComponent,
    IconCommentComponent,
    IconBookmarkComponent,
    ClickCursorDirective,
    AvatarComponent,
    LoaderComponent,
    InfiniteListComponent,
    InfiniteListEmptyComponent,
    InfiniteListEmptyTextComponent,
  ],
})
export class PostsComponent {
  ready = false;
  infiniteLoading = false;

  subscriptions: Record<string, Subscription> = {};

  items: Post[] = [];
  user!: User;

  // Todo: switch page on last post's id
  currentPage = 1;
  pageCount = 1;
  perPage = 2;

  @HostBinding('class.is-init') get init() {
    return !this.ready;
  }

  constructor(
    private userService: UserService,
    private postService: PostService,
    private likeService: LikeService,
    private saveService: SaveService,
    private commentService: CommentService,
    private followerService: FollowerService
  ) {}

  ngOnInit(): void {
    this.subscriptions['postService/history'] =
      this.postService.history$.subscribe((data) => {
        if (data.name === 'create') {
          this.loadItems(1);
        }
      });

    this.subscriptions['commentService/history'] =
      this.commentService.history$.subscribe((data) => {
        if (data.name === 'create') {
          //this.loadItems();
        }
      });

    this.subscriptions['userService/user'] = this.userService.user$.subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.loadItems(1);
        }
      }
    );
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  //----------------------

  loadItems(page: number) {
    this.postService
      .all({ id: this.user.id, page, 'per-page': this.perPage, without: true })
      .subscribe((data) => {
        this.ready = true;
        this.infiniteLoading = false;
        this.currentPage = data._meta.currentPage;
        this.pageCount = data._meta.pageCount;

        this.items = this.items.concat(data.items);
      });
  }

  nextPosts() {
    if (this.currentPage + 1 <= this.pageCount) {
      this.infiniteLoading = true;
      this.loadItems(this.currentPage + 1);
    }
  }

  getImage(files: any[]) {
    return `${environment.mediaPaths.post.original}/${files[0].file}`;
  }

  getAvatar(avatar: string) {
    return `${environment.mediaPaths.avatar.thumb}/${avatar}`;
  }

  like(item: Post) {
    if (!item.controls.liked) {
      this.likeService.create({ post_id: item.id }).subscribe(() => {
        item.likes++;
        item.controls.liked = !item.controls.liked;
      });
    } else {
      this.likeService.delete(item.id).subscribe(() => {
        item.likes--;
        item.controls.liked = !item.controls.liked;
      });
    }
  }

  save(item: Post) {
    if (!item.controls.saved) {
      this.saveService.create({ post_id: item.id }).subscribe(() => {
        item.controls.saved = !item.controls.saved;
      });
    } else {
      this.saveService.delete(item.id).subscribe(() => {
        item.controls.saved = !item.controls.saved;
      });
    }
  }

  follow(item: Post) {
    this.followerService.create(item.user.id).subscribe((data) => {
      item.controls.follow = data;
    });
  }

  unfollow(item: Post) {
    this.followerService.delete(item.controls.follow.id).subscribe((data) => {
      item.controls.follow = null;
    });
  }

  prepareDate(date: number) {
    return formatDistance(new Date(fromUnixTime(date)), new Date());
    // return formatDistance(new Date(fromUnixTime(date)), new Date(), {
    //   locale: ruLocale,
    // });
  }
}
