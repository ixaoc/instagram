import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabComponent } from 'components/tabs/tab/tab.component';
import { TabGroupComponent } from 'components/tabs/tab-group/tab-group.component';

import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TabGroupComponent, TabComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent {
  activeIndex = 0;

  tabs = [
    {
      label: 'Profile',
      content: ProfileComponent,
    },
    {
      label: 'Change password',
      content: ChangePasswordComponent,
    },
  ];
}
