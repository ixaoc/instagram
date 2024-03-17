import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from 'app/../environments/environment';

import {
  Subscription,
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
} from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';

import { debounceTimeAfterFirst } from 'helpers/async.helper';
import { ClickCursorDirective } from 'directives';

import { LoaderService, FollowerService, ProfileService } from 'services';

import { InputModule } from 'components/input/input.module';
import { ButtonComponent } from 'components/buttons/button/button.component';

import {
  LoaderComponent,
  AvatarComponent,
  InfiniteListComponent,
  InfiniteListEmptyComponent,
  InfiniteListEmptyTextComponent,
} from 'components';

interface Item {
  id: number;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  created: number;
  updated: number;
}

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.sass'],
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe,
    ClickCursorDirective,
    InputModule,
    LoaderComponent,
    ButtonComponent,
    AvatarComponent,
    InfiniteListComponent,
    InfiniteListEmptyComponent,
    InfiniteListEmptyTextComponent,
  ],
})
export class FollowingComponent implements OnInit {
  loading!: boolean;
  loadingData!: any;
  loadingProfile!: boolean;

  init = false;
  ready: boolean = false;
  currentPage = 1;
  pageCount = 1;

  subscriptions: Record<string, Subscription> = {};

  user!: any;
  items: Item[] = [];

  private subject = new BehaviorSubject<string>('');
  query$: Observable<any> = this.subject.asObservable();

  timeout = 450;

  constructor(
    private loaderService: LoaderService,
    private followerService: FollowerService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.subscriptions['profileService/history'] =
      this.profileService.user$.subscribe((user) => {
        this.user = user;
      });

    this.subscriptions['loader'] = this.loaderService.items$.subscribe(
      (data) => {
        this.loading = !!data['follower/list'];
        this.loadingProfile = !!data['user/profile'];
        this.loadingData = data;

        if (!this.loadingProfile && !this.init) {
          this.init = true;
          this.getList();
        }
      }
    );
  }

  getList() {
    this.query$
      .pipe(debounceTimeAfterFirst(this.timeout), distinctUntilChanged())
      .subscribe((query) => {
        this.followerService
          .list(this.user.id, query)
          .subscribe(({ items }: any) => {
            this.ready = true;
            this.items = items;
          });
      });
  }

  nextPosts() {}

  getAvatar(avatar: string) {
    return avatar ? `${environment.mediaPaths.avatar.thumb}/${avatar}` : '';
  }

  unfollow(id: number) {
    this.followerService.delete(id).subscribe((data) => {
      this.items = this.items.filter((data: Item) => data.id !== id);
    });
  }

  change(val: any) {
    const query = (val.target as any).value;
    this.subject.next(query);
  }

  deleting(id: number) {
    return !!this.loadingData[`follower/delete/${id}`];
  }
}
