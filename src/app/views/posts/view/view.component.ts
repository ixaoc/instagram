import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'app/../environments/environment';

import _ from 'lodash';
import { Subscription } from 'rxjs';
import { formatDistance, fromUnixTime } from 'date-fns';

import {
  Post,
  LoaderService,
  UserService,
  PostService,
  LikeService,
  SaveService,
  CommentService,
  FollowerService,
} from 'services';

import { AvatarComponent, ButtonComponent, ModalComponent } from 'components';
import { IconLikeComponent } from 'app/icons/icon-like/icon-like.component';
import { IconBookmarkComponent } from 'app/icons/icon-bookmark/icon-bookmark.component';

@Component({
  selector: 'app-posts-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    RouterLink,
    AvatarComponent,
    ButtonComponent,
    IconLikeComponent,
    IconBookmarkComponent,
  ],
})
export class ViewComponent {
  @ViewChild('comments') comments!: ElementRef<HTMLInputElement>;
  @ViewChild('text') text!: ElementRef<HTMLTextAreaElement>;

  @Input() id!: number;
  subscriptions: Record<string, Subscription> = {};

  ready = false;
  loading!: boolean;
  commentSaving!: boolean;
  deletion!: boolean;
  needScroll: boolean = true;
  item: any = null;
  openControls = false;

  size = 18;
  comment = '';

  get description() {
    const description = this.item.description.trim();
    return description.length > 0 ? description : null;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private userService: UserService,
    private postService: PostService,
    private likeService: LikeService,
    private saveService: SaveService,
    private followerService: FollowerService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loadItem();

    this.subscriptions['loaderService/item'] =
      this.loaderService.items$.subscribe((data) => {
        this.loading = !!data[`post/one/${this.id}`];
        this.commentSaving = !!data['comment/create'];
        this.deletion = !!data[`post/delete/${this.id}`];
      });

    this.subscriptions['postService/history'] =
      this.postService.history$.subscribe((data) => {
        if (data.name === 'delete') {
          //this.loadItems();
          // TO DO
        }
      });
  }

  ngAfterViewChecked() {
    this.scrollComments();
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  loadItem() {
    this.postService.one(this.id).subscribe((data) => {
      console.log(data);

      this.ready = true;
      this.item = data;
    });
  }

  delete() {
    this.postService.delete(this.id).subscribe((x) => {
      this.close();
    });
  }

  close() {
    this.router.navigate([{ outlets: { popup: null } }], {
      relativeTo: this.route.parent,
    });
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

  follow(item: any) {
    this.followerService.create(item.user.id).subscribe((data) => {
      item.controls.follow = data;
    });
  }

  unfollow(item: any) {
    this.followerService.delete(item.controls.follow.id).subscribe((data) => {
      item.controls.follow = null;
    });
  }

  prepareDate(date: number) {
    return formatDistance(new Date(fromUnixTime(date)), new Date(), {
      addSuffix: true,
    });
  }

  commentKeyUp(val: any) {
    const textarea = val.target;
    const limit = 160;

    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, limit) + 'px';

    this.comment = textarea.value;
  }

  scrollComments(): void {
    const el = this.comments?.nativeElement;

    if (this.needScroll && el) {
      el.scrollTo(0, el.scrollHeight);
      this.needScroll = false;
    }
  }

  submit(e: any) {
    e.preventDefault();

    this.commentService
      .create({ post_id: this.id, text: this.comment })
      .subscribe(
        (data) => {
          this.text.nativeElement.value = '';
          this.item._comments.push(data);
          this.needScroll = true;
          this.scrollComments();

          this.comments?.nativeElement.scrollTo(0, 0);
        },
        ({ error }) => {
          console.log(error);
        }
      );
  }
}
