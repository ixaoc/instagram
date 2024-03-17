import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from 'app/../environments/environment';

import _ from 'lodash';
import { Subscription } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';

import { LoaderService, UserService, ProfileService } from 'services';
import { LoaderComponent, AvatarComponent } from 'components';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LoaderComponent,
    AvatarComponent,
    TranslocoPipe,
  ],
})
export class ProfileComponent implements OnInit {
  loading!: boolean;
  subscriptions: Record<string, Subscription> = {};

  user!: any;
  get avatar() {
    return `${environment.mediaPaths.avatar.thumb}/${this.user.avatar}`;
  }

  constructor(
    private loaderService: LoaderService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.subscriptions['loader'] = this.loaderService.items$.subscribe(
      (data) => {
        this.loading = !!data['user/profile'];
      }
    );

    this.subscriptions['profileService/history'] =
      this.profileService.user$.subscribe((user) => {
        this.user = user;
      });
  }

  ngOnDestroy() {
    _.forEach(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
