import { Routes, UrlSegment } from '@angular/router';
import { AuthGuard } from 'helpers/auth.guard';

import { AuthLayoutComponent } from 'layouts/auth/auth.component';
import { MainLayoutComponent } from 'layouts/main/main.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MainLayoutComponent,
        children: [
          {
            path: 'add-post',
            loadComponent: () =>
              import('./views/posts/add/add.component').then(
                (x) => x.AddComponent
              ),
            outlet: 'popup',
          },

          {
            path: 'edit-post/:id',
            loadComponent: () =>
              import('./views/posts/edit/edit.component').then(
                (x) => x.EditComponent
              ),
            outlet: 'popup',
          },
          {
            path: 'view-post/:id',
            loadComponent: () =>
              import('./views/posts/view/view.component').then(
                (x) => x.ViewComponent
              ),
            outlet: 'popup',
          },
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./views/posts/posts.component').then(
                (x) => x.PostsComponent
              ),
          },
          {
            path: 'chats',
            loadComponent: () =>
              import('./views/chats/chats.component').then(
                (x) => x.ChatsComponent
              ),
          },
          {
            path: 'chats/:id',
            loadComponent: () =>
              import('./views/chats/details/chats-details.component').then(
                (x) => x.ChatsDetailsComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./views/settings/settings.component').then(
                (x) => x.SettingsComponent
              ),
          },
          {
            matcher: (url) => {
              if (url.length > 0 && url[0].path.match(/^@[\w]+$/gm)) {
                return {
                  consumed: url.slice(0, 1),
                  posParams: {
                    username: new UrlSegment(url[0].path.slice(1), {}),
                  },
                };
              }
              return null;
            },
            loadComponent: () =>
              import('./views/profile-section/profile-section.component').then(
                (x) => x.ProfileSectionComponent
              ),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './views/profile-section/profile/profile.component'
                  ).then((x) => x.ProfileComponent),
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    loadComponent: () =>
                      import(
                        './views/profile-section/profile/posts/posts.component'
                      ).then((x) => x.PostsComponent),
                  },
                  {
                    path: 'saved',
                    loadComponent: () =>
                      import(
                        './views/profile-section/profile/saved/saved.component'
                      ).then((x) => x.SavedComponent),
                  },
                ],
              },
              {
                path: 'following',
                loadComponent: () =>
                  import(
                    './views/profile-section/following/following.component'
                  ).then((x) => x.FollowingComponent),
              },
              {
                path: 'followers',
                loadComponent: () =>
                  import(
                    './views/profile-section/followers/followers.component'
                  ).then((x) => x.FollowersComponent),
              },
            ],
          },

          {
            path: '**',
            loadComponent: () =>
              import('./views/page-not-found/page-not-found.component').then(
                (x) => x.PageNotFoundComponent
              ),
          },
        ],
      },
    ],
    canMatch: [AuthGuard],
  },
  {
    path: '',
    children: [
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./views/auth/login/login.component').then(
                (x) => x.LoginComponent
              ),
          },
          {
            path: 'registration',
            loadComponent: () =>
              import('./views/auth/registration/registration.component').then(
                (x) => x.RegistrationComponent
              ),
          },
          {
            path: 'recovery',
            loadComponent: () =>
              import('./views/auth/recovery/recovery.component').then(
                (x) => x.RecoveryComponent
              ),
          },
        ],
      },
    ],
  },
];
